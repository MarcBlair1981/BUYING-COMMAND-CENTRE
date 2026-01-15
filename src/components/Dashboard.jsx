import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { HelpCircle, Grip, Globe, MonitorPlay, Folder, StickyNote, Cloud, LogIn, LogOut } from 'lucide-react';
import ModuleCard from './ModuleCard';
import AddModuleForm from './AddModuleForm';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';
import SyncConfigModal from './SyncConfigModal';
import { auth, db, initFirebase } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const Dashboard = () => {
    // Load initial state from localStorage or default
    const [modules, setModules] = useState(() => {
        const saved = localStorage.getItem('rcc_modules');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return [
            { id: '1', nickname: 'eBay GPU Search', url: 'https://www.ebay.com/sch/i.html?_nkw=rtx+3080', type: 'active_monitor' },
            { id: '2', nickname: 'Local Classifieds', url: 'https://craigslist.org', type: 'quick_link' },
            { id: '3', nickname: 'Daily Checks', type: 'group', links: [{ title: 'Reddit', url: 'https://reddit.com' }] },
        ];
    });

    const [user, setUser] = useState(null);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

    // Auth Listener
    useEffect(() => {
        if (!auth) return;
        return onAuthStateChanged(auth, (u) => setUser(u));
    }, [isSyncModalOpen]); // Re-bind if config changes (modal closes)

    // Database Listener (One-way sync from cloud to local for now, usually needs merge)
    useEffect(() => {
        if (!user || !db) return;
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
            if (doc.exists()) {
                const cloudModules = doc.data().modules;
                // Simple strategy: Cloud wins. Use timestamps for better merge in future.
                if (JSON.stringify(cloudModules) !== JSON.stringify(modules)) {
                    console.log("Synced from cloud");
                    setModules(cloudModules);
                }
            } else {
                // First time: push local to cloud
                saveToCloud(modules);
            }
        });
        return () => unsub();
    }, [user]);

    const saveToCloud = async (newModules) => {
        if (user && db) {
            await setDoc(doc(db, "users", user.uid), { modules: newModules, updatedAt: new Date() });
        }
    };

    useEffect(() => {
        localStorage.setItem('rcc_modules', JSON.stringify(modules));
        // Also save to cloud if logged in
        if (user) saveToCloud(modules);
    }, [modules, user]);

    const handleGoogleLogin = async () => {
        if (!auth) {
            setIsSyncModalOpen(true);
            return;
        }
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (e) {
            console.error("Login failed", e);
            if (e.code === 'auth/configuration-not-found' || e.code === 'auth/api-key-not-valid') {
                setIsSyncModalOpen(true); // Re-open config if keys are wrong
            }
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleUpdateModule = (id, updates) => {
        setModules((items) =>
            items.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setModules((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAddModule = (newModule) => {
        const moduleWithId = {
            ...newModule,
            id: Date.now().toString(), // Simple ID generation
            links: newModule.type === 'group' ? [] : undefined,
        };
        setModules([...modules, moduleWithId]);
    };

    const handleDeleteModule = (id) => {
        if (window.confirm('Are you sure you want to delete this module?')) {
            setModules((items) => items.filter((item) => item.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            {/* Guidance / Legend Section */}
            <div className="bg-search-gray border border-border p-4 rounded-lg bg-card/50 backdrop-blur-sm">
                <div className="flex flex-wrap gap-6 items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">Dashboard Guide:</span>
                    </div>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 hover:text-foreground transition-colors cursor-help">
                                <Grip className="w-4 h-4" />
                                <span>Reordering</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Drag and drop any card to reorder your dashboard.</p>
                                <p className="text-xs text-muted-foreground mt-1">Layout is saved automatically.</p>
                            </TooltipContent>
                        </Tooltip>

                        <div className="h-4 w-px bg-border mx-2" />

                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 text-green-500 hover:text-green-600 transition-colors cursor-help">
                                <Globe className="w-4 h-4" />
                                <span>Quick Link</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Standard bookmark (Green).</p>
                                <p className="text-xs text-muted-foreground mt-1">Click to open URL in a new tab.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors cursor-help">
                                <MonitorPlay className="w-4 h-4" />
                                <span>Active Monitor</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Agent Task (Blue).</p>
                                <p className="text-xs text-muted-foreground mt-1">Runs a background agent to check this URL.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 text-purple-500 hover:text-purple-600 transition-colors cursor-help">
                                <Folder className="w-4 h-4" />
                                <span>Group</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Collection (Purple).</p>
                                <p className="text-xs text-muted-foreground mt-1">Holds multiple quick links.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 transition-colors cursor-help">
                                <StickyNote className="w-4 h-4" />
                                <span>Note</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Notepad (Yellow).</p>
                                <p className="text-xs text-muted-foreground mt-1">Simple text area for notes.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={modules.map(m => m.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {modules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                module={module}
                                onUpdate={handleUpdateModule}
                                onDelete={handleDeleteModule}
                            />
                        ))}
                        <div className="aspect-square">
                            <AddModuleForm onAdd={handleAddModule} />
                        </div>
                    </div>
                </SortableContext>
            </DndContext>

            <SyncConfigModal
                isOpen={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
                onConfigSaved={() => window.location.reload()}
            />

            {/* Data Management Footer */}
            <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    {user ? (
                        <span className="flex items-center gap-2 text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                            <Cloud className="w-4 h-4" /> Synced as {user.email}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Cloud className="w-4 h-4 text-muted-foreground/50" /> Local Mode (Not Synced)
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <button
                            onClick={() => signOut(auth)}
                            className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded border border-red-500/20 transition-colors font-medium flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded border border-transparent transition-colors font-medium flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            <LogIn className="w-4 h-4" /> Connect Google Account
                        </button>
                    )}

                    <div className="h-4 w-px bg-border mx-2" />

                    <button
                        onClick={() => {
                            const dataStr = JSON.stringify(modules, null, 2);
                            const blob = new Blob([dataStr], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = "rcc_backup_" + new Date().toISOString().split('T')[0] + ".json";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="text-xs hover:text-foreground underline underline-offset-4"
                    >
                        Export Backup File
                    </button>
                </div>
            </div>
        </div>
    );

};

export default Dashboard;

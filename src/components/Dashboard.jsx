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
import { HelpCircle, Grip, Globe, MonitorPlay, Folder, StickyNote } from 'lucide-react';
import ModuleCard from './ModuleCard';
import AddModuleForm from './AddModuleForm';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';

const Dashboard = () => {
    // Load initial state from localStorage or default
    const [modules, setModules] = useState(() => {
        const saved = localStorage.getItem('rcc_modules');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse modules", e);
            }
        }
        return [
            { id: '1', nickname: 'eBay GPU Search', url: 'https://www.ebay.com/sch/i.html?_nkw=rtx+3080', type: 'active_monitor' },
            { id: '2', nickname: 'Local Classifieds', url: 'https://craigslist.org', type: 'quick_link' },
            { id: '3', nickname: 'Daily Checks', type: 'group', links: [{ title: 'Reddit', url: 'https://reddit.com' }] },
        ];
    });

    useEffect(() => {
        localStorage.setItem('rcc_modules', JSON.stringify(modules));
    }, [modules]);

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

            {/* Data Management Footer */}
            <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <p>Data stored locally in your browser.</p>
                <div className="flex items-center gap-3">
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
                        className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded border border-border transition-colors font-medium flex items-center gap-2"
                    >
                        Save to File (Export)
                    </button>
                    <label className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded border border-border transition-colors font-medium flex items-center gap-2 cursor-pointer">
                        Load from File (Import)
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    try {
                                        const imported = JSON.parse(event.target.result);
                                        if (Array.isArray(imported)) {
                                            if (confirm("This will overwrite your current dashboard. Are you sure?")) {
                                                setModules(imported);
                                                // Force refresh trigger if needed, but state update handles it
                                            }
                                        } else {
                                            alert("Invalid file format.");
                                        }
                                    } catch (err) {
                                        alert("Failed to read file.");
                                    }
                                };
                                reader.readAsText(file);
                                e.target.value = null; // Reset
                            }}
                        />
                    </label>
                </div>
            </div>
        </div>
    );

};

export default Dashboard;

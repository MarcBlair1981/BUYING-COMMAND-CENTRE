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
import { HelpCircle, Grip, Globe, MonitorPlay } from 'lucide-react';
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

                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 hover:text-green-500 transition-colors cursor-help">
                                <Globe className="w-4 h-4" />
                                <span>Quick Link Mode</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Standard bookmarks. Click to open URL in a new tab.</p>
                                <p className="text-xs text-muted-foreground mt-1">Best for: Static sites, reference pages.</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-help">
                                <MonitorPlay className="w-4 h-4" />
                                <span>Active Monitor Mode</span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Trigger Antigravity Agents to check this URL.</p>
                                <p className="text-xs text-muted-foreground mt-1">Best for: Tracking sold listings, price changes.</p>
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
                            />
                        ))}
                        <div className="aspect-square">
                            <AddModuleForm onAdd={handleAddModule} />
                        </div>
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default Dashboard;

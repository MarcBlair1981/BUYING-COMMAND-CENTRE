import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, Play, GripVertical, Plus, Trash2, Folder } from 'lucide-react';
import { cn } from "@/lib/utils";
import InfoTooltip from './InfoTooltip';

const ModuleCard = ({ module, onUpdate, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: module.id });

    const [isAddingLink, setIsAddingLink] = useState(false);
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    const ensureProtocol = (url) => {
        if (!url) return '';
        if (!/^https?:\/\//i.test(url)) {
            return 'https://' + url;
        }
        return url;
    };

    const handleLinkClick = (e, url) => {
        e.stopPropagation(); // Prevent drag start
        // Standard anchor behavior takes over
    };

    const handleCheckNow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic UI feedback could be added here
        console.log(`[Active Monitor] Requesting check for ${module.nickname}...`);

        try {
            const response = await fetch('http://localhost:3001/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: ensureProtocol(module.url),
                    nickname: module.nickname
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Server error');
            }

        } catch (error) {
            console.error('Check failed:', error);
            alert(`Failed to start Agent:\n${error.message}\n\nMake sure 'start_server.bat' is running!`);
        }
    };

    const handleAddLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!newLinkTitle || !newLinkUrl) return;

        const updatedLinks = [...(module.links || []), { title: newLinkTitle, url: ensureProtocol(newLinkUrl) }];
        onUpdate(module.id, { links: updatedLinks });

        setNewLinkTitle('');
        setNewLinkUrl('');
        setIsAddingLink(false);
    };

    const removeLink = (index) => {
        const updatedLinks = module.links.filter((_, i) => i !== index);
        onUpdate(module.id, { links: updatedLinks });
    };

    const getBorderColor = () => {
        if (module.type === 'active_monitor') return 'border-l-blue-500';
        if (module.type === 'group') return 'border-l-purple-500';
        if (module.type === 'note') return 'border-l-yellow-500';
        return 'border-l-green-500';
    };

    const domain = module.url ? new URL(ensureProtocol(module.url)).hostname.replace('www.', '') : '';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative flex flex-col p-5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden aspect-square ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "border-l-4",
                getBorderColor()
            )}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-2">
                    <input
                        value={module.nickname}
                        onChange={(e) => onUpdate(module.id, { nickname: e.target.value })}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="font-semibold text-lg text-card-foreground bg-transparent border-none focus:outline-none focus:ring-0 w-full truncate p-0 placeholder:text-muted-foreground/50 border-b border-transparent focus:border-border hover:border-border/50 transition-colors"
                        placeholder="Module Name"
                    />
                    {module.type !== 'group' && (
                        <span className="text-xs text-muted-foreground truncate block" title={module.url}>
                            {domain}
                        </span>
                    )}
                    {module.type === 'group' && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Folder className="w-3 h-3" /> {module.links?.length || 0} links
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <InfoTooltip content={
                        module.type === 'quick_link' ? "Quick Link: Click to open." :
                            module.type === 'active_monitor' ? "Active Monitor: Click 'Check Now' to run agent." :
                                "Group: A collection of quick links."
                    } />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(module.id);
                        }}
                        className="p-1 text-muted-foreground/50 hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                        title="Delete Module"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground/50 hover:text-muted-foreground rounded-md hover:bg-muted">
                        <GripVertical className="h-4 w-4" />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2 no-scrollbar">
                {module.type === 'note' ? (
                    <textarea
                        className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-sm text-muted-foreground placeholder:text-muted-foreground/50"
                        placeholder="Type your notes here..."
                        value={module.noteContent || ''}
                        onChange={(e) => onUpdate(module.id, { noteContent: e.target.value })}
                        onPointerDown={(e) => e.stopPropagation()}
                    />
                ) : module.type === 'group' ? (
                    <div className="space-y-1">
                        {module.links?.map((link, idx) => (
                            <div key={idx} className="group/link flex items-center justify-between text-sm p-1.5 rounded hover:bg-muted/50 transition-colors">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="flex-1 truncate text-foreground/80 hover:text-primary flex items-center gap-2"
                                >
                                    <ExternalLink className="w-3 h-3 opacity-50" />
                                    {link.title}
                                </a>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeLink(idx); }}
                                    className="opacity-0 group-hover/link:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}

                        {isAddingLink ? (
                            <div className="p-2 bg-muted/30 rounded-md border border-border/50 animate-in fade-in zoom-in-95" onPointerDown={e => e.stopPropagation()}>
                                <input
                                    autoFocus
                                    placeholder="Title (e.g. Amazon)"
                                    className="w-full text-xs bg-transparent border-b border-border/50 focus:border-primary outline-none mb-1 p-0.5"
                                    value={newLinkTitle}
                                    onChange={e => setNewLinkTitle(e.target.value)}
                                />
                                <input
                                    placeholder="URL"
                                    className="w-full text-xs bg-transparent border-b border-border/50 focus:border-primary outline-none mb-2 p-0.5"
                                    value={newLinkUrl}
                                    onChange={e => setNewLinkUrl(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleAddLink(e); }}
                                />
                                <div className="flex justify-end gap-1">
                                    <button onClick={() => setIsAddingLink(false)} className="text-[10px] px-1.5 py-0.5 text-muted-foreground hover:text-foreground">Cancel</button>
                                    <button onClick={handleAddLink} className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Add</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsAddingLink(true); }}
                                className="w-full py-1.5 text-xs text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary/50 rounded-md flex items-center justify-center gap-1 transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add Link
                            </button>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Footer Actions for Single Cards */}
            {module.type !== 'group' && module.type !== 'note' && (
                <div className="mt-4 pt-2">
                    {module.type === 'quick_link' ? (
                        <a
                            href={ensureProtocol(module.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onPointerDown={(e) => e.stopPropagation()}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                        >
                            Visit Site <ExternalLink className="h-4 w-4" />
                        </a>
                    ) : (
                        <button
                            onClick={handleCheckNow}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-blue-500/20"
                        >
                            Check Now <Play className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}

            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        </div>
    );
};

export default ModuleCard;

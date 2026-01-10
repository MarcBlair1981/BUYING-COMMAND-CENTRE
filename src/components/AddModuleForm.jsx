import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

const AddModuleForm = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [nickname, setNickname] = useState('');
    const [url, setUrl] = useState('');
    const [type, setType] = useState('quick_link');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nickname || !url) return;

        onAdd({ nickname, url, type });
        // Reset
        setNickname('');
        setUrl('');
        setType('quick_link');
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="h-full min-h-[160px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 text-muted-foreground hover:text-primary rounded-xl transition-all hover:bg-muted/50"
            >
                <Plus className="h-8 w-8 mb-2" />
                <span className="font-medium">Add Module</span>
            </button>
        );
    }

    return (
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-lg text-card-foreground mb-4">New Module</h3>
            <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col">
                <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Nickname</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g. eBay Graphics Cards"
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">URL</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required={type !== 'group' && type !== 'note'}
                        disabled={type === 'group' || type === 'note'}
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setType('quick_link')}
                            className={cn(
                                "px-2 py-1.5 text-xs font-medium rounded-md border transition-colors",
                                type === 'quick_link' ? "bg-green-500/10 border-green-500 text-green-500" : "bg-background border-input text-muted-foreground hover:bg-muted"
                            )}
                        >
                            Quick Link
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('active_monitor')}
                            className={cn(
                                "px-2 py-1.5 text-xs font-medium rounded-md border transition-colors",
                                type === 'active_monitor' ? "bg-blue-500/10 border-blue-500 text-blue-500" : "bg-background border-input text-muted-foreground hover:bg-muted"
                            )}
                        >
                            Active Monitor
                        </button>
                        <button
                            type="button"
                            onClick={() => { setType('group'); setUrl(''); }}
                            className={cn(
                                "px-2 py-1.5 text-xs font-medium rounded-md border transition-colors",
                                type === 'group' ? "bg-purple-500/10 border-purple-500 text-purple-500" : "bg-background border-input text-muted-foreground hover:bg-muted"
                            )}
                        >
                            Group
                        </button>
                        <button
                            type="button"
                            onClick={() => { setType('note'); setUrl(''); }}
                            className={cn(
                                "px-2 py-1.5 text-xs font-medium rounded-md border transition-colors",
                                type === 'note' ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" : "bg-background border-input text-muted-foreground hover:bg-muted"
                            )}
                        >
                            Note / Text
                        </button>
                    </div>
                </div>

                <div className="mt-auto flex gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddModuleForm;

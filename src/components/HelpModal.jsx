import React from 'react';
import { X, Server, Smartphone, ShieldCheck, Database, MonitorPlay, ExternalLink, Box } from 'lucide-react';

const Section = ({ icon: Icon, title, children, color = "text-primary" }) => (
    <div className="flex gap-4 items-start">
        <div className={`mt-1 p-2 rounded-lg bg-muted ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">{title}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed">
                {children}
            </div>
        </div>
    </div>
);

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-border bg-muted/10">
                    <h2 className="text-2xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                        Command Center Guide
                    </h2>
                    <p className="text-muted-foreground mt-1">Everything you need to know about your dashboard.</p>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">

                    {/* Usage */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Module Types</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg border border-border bg-muted/5">
                                <div className="flex items-center gap-2 mb-2 text-green-500 font-medium">
                                    <ExternalLink className="w-4 h-4" /> Quick Link
                                </div>
                                <p className="text-xs text-muted-foreground">Standard bookmarks. Click to open efficiently in a new tab.</p>
                            </div>
                            <div className="p-3 rounded-lg border border-border bg-muted/5">
                                <div className="flex items-center gap-2 mb-2 text-blue-500 font-medium">
                                    <MonitorPlay className="w-4 h-4" /> Active Monitor
                                </div>
                                <p className="text-xs text-muted-foreground">Automation task. "Check Now" triggers the local agent to open and inspect the URL (e.g., checking eBay Stock).</p>
                            </div>
                            <div className="p-3 rounded-lg border border-border bg-muted/5">
                                <div className="flex items-center gap-2 mb-2 text-purple-500 font-medium">
                                    <Box className="w-4 h-4" /> Group
                                </div>
                                <p className="text-xs text-muted-foreground">A folder for related links. Great for organizing "Daily Checks" or "Competitors".</p>
                            </div>
                            <div className="p-3 rounded-lg border border-border bg-muted/5">
                                <div className="flex items-center gap-2 mb-2 text-yellow-500 font-medium">
                                    <Box className="w-4 h-4" /> Note
                                </div>
                                <p className="text-xs text-muted-foreground">A simple text pad. Use it for to-do lists, templates, or temporary reminders.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">System Info</h4>

                        <Section icon={Box} title="Managing Modules" color="text-red-500">
                            To <strong>delete</strong> a module, look for the Trash icon <span className="inline-flex items-center justify-center p-1 bg-muted rounded"><X className="w-3 h-3" /></span> in the top-right corner of the card.
                            <br />
                            You can rearrange modules by dragging them with the handle icon.
                        </Section>

                        <Section icon={ShieldCheck} title="Privacy & Data Storage">
                            Your dashboard layout and links are saved <strong>locally in your browser</strong>.
                            <br />
                            Nothing is sent to a cloud database. If you clear your browser cookies, you usually lose this data.
                        </Section>

                        <Section icon={Smartphone} title="Using on Mobile / Other Devices">
                            Because data is saved locally, <strong>your phone will not reproduce your PC layout</strong> automatically.
                            <br />
                            You can still use the site on your phone to create a separate "Mobile Dashboard".
                        </Section>

                        <Section icon={Server} title="How to run 'Active Monitor'" color="text-blue-500">
                            The Active Monitor requires the Local Automation Server to be running on your PC.
                            <ul className="list-disc list-inside mt-2 space-y-1 ml-1">
                                <li><strong>To Start:</strong> Double-click <code className="bg-muted px-1.5 py-0.5 rounded border border-border">start_full_system.bat</code> on your desktop.</li>
                                <li>This opens two windows: one for the Server, one for this Dashboard.</li>
                                <li>Keep both open to use the "Check Now" buttons.</li>
                            </ul>
                        </Section>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HelpModal;

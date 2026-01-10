import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import HelpModal from './components/HelpModal';
import { HelpCircle } from 'lucide-react';

function App() {
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

            <header className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-40">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Reseller Command Center</h1>
                    <p className="text-muted-foreground hidden sm:block">Centralize your disorganized bookmarks and marketplace searches.</p>
                </div>
                <button
                    onClick={() => setShowHelp(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">Guide</span>
                </button>
            </header>
            <main className="p-6">
                <Dashboard />
            </main>
        </div>
    );
}

export default App;

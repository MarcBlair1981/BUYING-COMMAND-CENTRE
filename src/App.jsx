import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Reseller Command Center</h1>
                    <p className="text-muted-foreground">Centralize your disorganized bookmarks and marketplace searches.</p>
                </div>
            </header>
            <main className="p-6">
                <Dashboard />
            </main>
        </div>
    );
}

export default App;

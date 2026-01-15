import React, { useState } from 'react';
import { Cloud, Save, CheckCircle, AlertTriangle, Key } from 'lucide-react';
import { initFirebase } from '@/lib/firebase';

const SyncConfigModal = ({ isOpen, onClose, onConfigSaved }) => {
    const [configJson, setConfigJson] = useState('');
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSave = () => {
        try {
            // Flexible parsing: Try to find JSON object even if they paste a whole JS file content
            let jsonStr = configJson;
            // If they paste "const firebaseConfig = { ... };", try to extract the { ... }
            const match = configJson.match(/{[\s\S]*}/);
            if (match) {
                jsonStr = match[0];
            }

            // Fix lazy object keys (e.g. apiKey: "..." -> "apiKey": "...")
            // rigorous regex replacement is hard, better to ask user for clean JSON?
            // Usually firebase console gives:
            // const firebaseConfig = { ... };
            // Let's assume standard JSON or relaxed JSON if possible. 
            // JSON.parse requires strict quotes.
            // Let's rely on user getting it mostly right, or guide them.

            const config = JSON.parse(jsonStr);

            if (!config.apiKey || !config.projectId) {
                throw new Error("Invalid Config: Missing apiKey or projectId");
            }

            localStorage.setItem('rcc_firebase_config', JSON.stringify(config));
            initFirebase(config);
            onConfigSaved();
            onClose();
        } catch (e) {
            setError("Could not parse configuration. Please paste the 'firebaseConfig' object strictly as JSON (keys with quotes). " + e.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border bg-muted/10 flex items-center gap-3">
                    <Cloud className="w-6 h-6 text-primary" />
                    <div>
                        <h2 className="text-xl font-bold">Connect to Google Cloud</h2>
                        <p className="text-sm text-muted-foreground">Sync your dashboard across devices securely.</p>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto space-y-4">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400">
                        <strong>Why do I need this?</strong> To sync data, we need a secure place to store it. Firebase is Google's free database service.
                    </div>

                    <div className="space-y-2 text-sm">
                        <p className="font-semibold">Step 1: Get your Configuration</p>
                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" className="text-primary hover:underline">console.firebase.google.com</a></li>
                            <li>Click <strong>Add Project</strong> (name it anything).</li>
                            <li>Disable Analytics (faster setup).</li>
                            <li>Once created, click the <strong>Web Icon (&lt;/&gt;)</strong> to add an app.</li>
                            <li>Copy the <code>firebaseConfig</code> object.</li>
                        </ol>
                    </div>

                    <div className="space-y-2 text-sm">
                        <p className="font-semibold">Step 2: Enable Database & Auth</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>In the sidebar, go to <strong>Build &gt; Authentication</strong>. Click Get Started -> Enable <strong>Google</strong>.</li>
                            <li>Go to <strong>Build &gt; Firestore Database</strong>. Click Create -> Start in <strong>Production Mode</strong>.</li>
                            <li>Go to <strong>Rules</strong> tab in Firestore and allow read/write (for now): <br />
                                <code className="bg-muted px-1">allow read, write: if request.auth != null;</code>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Step 3: Paste your Config Code here</label>
                        <textarea
                            value={configJson}
                            onChange={e => setConfigJson(e.target.value)}
                            className="w-full h-32 bg-muted/30 border border-border rounded-md p-3 text-xs font-mono focus:border-primary outline-none"
                            placeholder={'{ "apiKey": "AIza...", "authDomain": "...", ... }'}
                        />
                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded">
                                <AlertTriangle className="w-4 h-4" /> {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={!configJson}
                        className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SyncConfigModal;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Server, CheckCircle, XCircle, Globe, ShieldCheck } from 'lucide-react';

interface Props {
    onConnectionVerified: (url: string) => void;
}

export const ConnectionWizard: React.FC<Props> = ({ onConnectionVerified }) => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    // Auto-check existing URL on mount
    useEffect(() => {
        const saved = localStorage.getItem('custom_backend_url') || import.meta.env.VITE_API_URL || 'https://grand-flow.up.railway.app';
        if (saved) {
            setUrl(saved);
            checkConnection(saved, true); // Silent check initially? modify logic if needed
        }
    }, []);

    const checkConnection = async (targetUrl: string, silent = false) => {
        // Normalize URL: remove trailing slash
        const cleanUrl = targetUrl.replace(/\/$/, '');

        if (!silent) setStatus('checking');

        try {
            // We try to hit the docs or parse endpoint to verify life
            // A HEAD request to /docs is a good proxy for FastAPI
            await axios.get(`${cleanUrl}/docs`, { timeout: 5000 });

            setStatus('success');
            setTimeout(() => {
                onConnectionVerified(cleanUrl);
            }, 800);
        } catch (err: any) {
            // Fallback: try root
            try {
                await axios.get(`${cleanUrl}/`, { timeout: 3000 });
                setStatus('success');
                setTimeout(() => {
                    onConnectionVerified(cleanUrl);
                }, 800);
            } catch (innerErr) {
                if (!silent) {
                    setStatus('error');
                    setErrorMsg('Could not reach server. Check URL.');
                }
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        checkConnection(url);
    };

    if (status === 'success') {
        return (
            <div style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <CheckCircle size={64} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '2rem', fontWeight: 200 }}>System Connected</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome to NOTAM Studio v2.0</p>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--bg-dark)',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                width: '100%', maxWidth: '450px',
                padding: '2.5rem',
                background: 'var(--bg-card)',
                backdropFilter: 'var(--glass-effect)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px', height: '64px', margin: '0 auto 1.5rem',
                        background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Server size={32} color="var(--accent-primary)" />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Connect Server</h1>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                        Enter your Railway Backend URL to initialize the studio.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            Backend URL
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://your-project.up.railway.app"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    background: '#0f172a', /* darker input */
                                    border: `1px solid ${status === 'error' ? 'var(--accent-secondary)' : '#334155'}`,
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>
                        {status === 'error' && (
                            <div style={{ marginTop: '0.5rem', color: 'var(--accent-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <XCircle size={14} /> {errorMsg}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'checking'}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            background: status === 'checking' ? '#334155' : 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: status === 'checking' ? 'wait' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {status === 'checking' ? 'Verifying...' : 'Connect & Initialize'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Secure Connection • NOTAM Studio v2.0
                    </p>
                </div>
            </div>
        </div>
    );
};

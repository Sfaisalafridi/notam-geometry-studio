import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tesseract from 'tesseract.js';
import { Upload, Layers, Activity, Database, FileText, Globe, PenTool, Trash2 } from 'lucide-react';
import type { Notam } from '../types';
import { parseLocal } from '../localParser';

interface Props {
    notams: Notam[];
    setNotams: React.Dispatch<React.SetStateAction<Notam[]>>;
    onSelect: (id: string) => void;
    onExport: () => void;
    selectedId: string | null;
}

export const Sidebar: React.FC<Props> = ({ notams, setNotams, onSelect, onExport, selectedId }) => {
    const [activeTab, setActiveTab] = useState<'editor' | 'layers'>('editor');
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const [globalAirports, setGlobalAirports] = useState<Record<string, any>>({});

    useEffect(() => {
        fetch('/airports.json').then(res => res.json()).then(setGlobalAirports).catch(console.error);
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLoading(true); setStatus('Scanning Intelligence (OCR)...');
            try {
                const { data: { text } } = await Tesseract.recognize(file, 'eng');
                setTextInput(text);
                setStatus('OCR Extraction Complete.');
            } catch (err) { setStatus('OCR Failed.'); }
            finally { setLoading(false); }
        }
    };

    const handleParseNotam = async () => {
        if (!textInput.trim()) return;
        setLoading(true);
        setStatus('Analyzing Intel...'); // Show immediate feedback

        try {
            // Priority 1: Cloud API (Netlify Functions)
            // We use a relative path '/api/parse' which Netlify redirects to the function
            const apiUrl = import.meta.env.VITE_API_URL || '';
            // If VITE_API_URL is set (e.g. to https://notamstudio.net), we use it, otherwise relative.
            // For production on same domain, relative path '/api/parse' works best.

            let cloudSuccess = false;

            try {
                // Try cloud parsing first
                const endpoint = apiUrl ? `${apiUrl}/api/parse` : '/api/parse';
                const response = await axios.post(endpoint, { text: textInput });

                if (response.data && response.data.results) {
                    const newNotams = response.data.results.map((item: any) => ({
                        id: crypto.randomUUID(),
                        raw_text: item.raw_text, geometry: item.geometry, altitude: item.altitude,
                        description: item.description, ids: item.ids, visible: true, color: '#ef4444'
                    }));
                    setNotams(prev => [...newNotams, ...prev]);
                    setStatus(`Analysis Complete: ${newNotams.length} areas processed (Cloud).`);
                    setActiveTab('layers');
                    cloudSuccess = true;
                }
            } catch (apiError) {
                console.warn('Cloud API unavailable, switching to local engine.', apiError);
                // Fallthrough to local
            }

            if (!cloudSuccess) {
                // Priority 2: Local Processing Engine (Fallback)
                console.log('Using local parser engine...');
                const result = parseLocal(textInput, globalAirports);

                const newNotams = result.results.map((item: any) => ({
                    id: crypto.randomUUID(),
                    raw_text: item.raw_text, geometry: item.geometry, altitude: item.altitude,
                    description: item.description, ids: item.ids, visible: true, color: '#ef4444'
                }));

                setNotams(prev => [...newNotams, ...prev]);
                setStatus(`Analysis Complete: ${newNotams.length} areas processed (Local).`);
                setActiveTab('layers');
            }

        } catch (e) {
            console.error('Parsing error:', e);
            setStatus('Analysis Failed');
        } finally {
            setLoading(false);
        }
    };

    const removeNotam = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setNotams(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = () => { if (confirm('Clear ALL?')) setNotams([]); };

    return (
        <div style={{ width: '400px', height: '100vh', background: '#09090b', borderRight: '1px solid #27272a', display: 'flex', flexDirection: 'column', color: '#e4e4e7', zIndex: 1000, boxShadow: '4px 0 24px rgba(0,0,0,0.4)' }}>

            <div style={{ padding: '24px 20px', borderBottom: '1px solid #27272a', background: '#18181b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ background: '#0ea5e9', padding: '8px', borderRadius: '6px' }}>
                        <PenTool size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px', lineHeight: 1 }}>NOTAM<span style={{ color: '#0ea5e9' }}>STUDIO</span></div>

                        <div style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 600, marginTop: '2px' }}>PROFESSIONAL EDITION v3.0 (FINAL)</div>
                    </div>
                </div>
            </div>

            {/* UPDATED TABS: MATCHING SCREENSHOT */}
            <div style={{ padding: '10px 20px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setActiveTab('editor')}
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', background: activeTab === 'editor' ? '#0ea5e9' : 'transparent', color: activeTab === 'editor' ? 'white' : '#71717a', border: activeTab === 'editor' ? 'none' : '1px solid #3f3f46', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                    <PenTool size={14} /> Input Data
                </button>
                <button
                    onClick={() => setActiveTab('layers')}
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', background: activeTab === 'layers' ? '#0ea5e9' : 'transparent', color: activeTab === 'layers' ? 'white' : '#71717a', border: activeTab === 'layers' ? 'none' : '1px solid #3f3f46', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                    <Layers size={14} /> Active ({notams.length})
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {activeTab === 'editor' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div style={{ background: '#18181b', padding: '16px', borderRadius: '8px', border: '1px solid #27272a' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Upload size={14} /> IMPORT INTEL (OCR)
                            </div>

                            <label style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                width: '100%', padding: '12px', background: '#27272a', border: '1px dashed #52525b',
                                borderRadius: '6px', cursor: 'pointer', color: '#e4e4e7', fontSize: '0.85rem', fontWeight: 600,
                                transition: 'all 0.2s ease'
                            }}>
                                <Upload size={16} /> UPLOAD IMAGE
                                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>

                            <textarea
                                value={textInput} onChange={e => setTextInput(e.target.value)}
                                placeholder="Paste NOTAM text here to parse geometry..."
                                style={{ width: '100%', height: '150px', padding: '12px', marginTop: '10px', background: '#09090b', border: '1px solid #3f3f46', color: '#e4e4e7', borderRadius: '6px', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem', resize: 'vertical' }}
                            />

                            <button
                                onClick={handleParseNotam}
                                disabled={loading || !textInput.trim()}
                                style={{ width: '100%', padding: '10px', marginTop: '10px', background: loading ? '#27272a' : '#0ea5e9', color: loading ? '#71717a' : 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: loading ? 'wait' : 'pointer' }}
                            >
                                {loading ? 'PARSING...' : 'CONVERT TEXT TO GEOMETRY'}
                            </button>
                        </div>

                        <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid #0369a1' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#38bdf8', marginBottom: '8px' }}>
                                MAP PAINTING TOOLS
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#e0f2fe', lineHeight: 1.4 }}>
                                Use the toolbar on the map (top-left) to draw Polygons, Rectangles, Circles, and Lines.
                            </div>
                        </div>

                        {status && (
                            <div style={{ padding: '12px', background: status.includes('Failed') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${status.includes('Failed') ? '#ef4444' : '#10b981'}`, borderRadius: '6px', fontSize: '0.8rem', color: status.includes('Failed') ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity size={14} /> {status}
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
                            <div style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Database size={12} /> DATABASE STATUS
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                                <span>Global Airports</span>
                                <span style={{ color: Object.keys(globalAirports).length > 0 ? '#10b981' : '#ef4444' }}>
                                    {Object.keys(globalAirports).length > 0 ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'layers' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={clearAll} style={{ padding: '8px', marginBottom: '10px', background: '#27272a', border: '1px solid #3f3f46', color: '#ef4444', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>CLEAR ALL LAYERS</button>
                        {notams.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#52525b', padding: '40px 20px', border: '2px dashed #27272a', borderRadius: '8px' }}>
                                <Layers size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                <div>No Active Layers</div>
                            </div>
                        )}
                        {notams.map(n => (
                            <div key={n.id} onClick={() => onSelect(n.id)} style={{ padding: '12px', background: selectedId === n.id ? '#27272a' : '#18181b', border: '1px solid #3f3f46', borderRadius: '6px', cursor: 'pointer', borderLeft: `4px solid ${n.color}`, transition: 'all 0.2s', position: 'relative' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#e4e4e7' }}>{n.ids[0]}</div>
                                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.description || n.raw_text.substring(0, 40)}</div>
                                <button onClick={(e) => removeNotam(e, n.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #27272a', background: '#18181b' }}>
                <button onClick={onExport} style={{ width: '100%', padding: '12px', background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                    <Upload size={16} /> EXPORT MAP IMAGE
                </button>
            </div>
        </div>
    );
};

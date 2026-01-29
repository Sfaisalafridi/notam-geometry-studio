import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Layers, Eye, EyeOff, Trash2, Map, ShieldAlert, Cpu } from 'lucide-react';
import axios from 'axios';
import type { Notam } from '../types';

// The URL is now strictly managed by the ConnectionWizard/App.tsx flow
// But we still need a fallback for type safety, though it should be guaranteed by App
const API_BASE_URL = 'https://grand-flow.up.railway.app';

interface Props {
    notams: Notam[];
    setNotams: React.Dispatch<React.SetStateAction<Notam[]>>;
    onSelect: (id: string) => void;
    onExport: () => void;
}

export const Sidebar: React.FC<Props> = ({ notams, setNotams, onSelect, onExport }) => {
    const [activeTab, setActiveTab] = useState<'input' | 'list'>('input');
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLoading(true);
            setStatus('Scanning Image (OCR)...');
            try {
                const { data: { text } } = await Tesseract.recognize(file, 'eng');
                setTextInput(text);
                setStatus('OCR Complete. Ready to parse.');
            } catch (err) {
                setStatus('OCR Failed.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleParse = async () => {
        if (!textInput.trim()) return;
        setLoading(true);
        setStatus('Analyzing Flight Data...');
        try {
            // Remove trailing slash if present for safety
            const safeBase = API_BASE_URL.replace(/\/$/, '');
            const response = await axios.post(`${safeBase}/api/parse`, { text: textInput });
            const result = response.data;

            const newNotams = result.results.map((item: any) => ({
                id: crypto.randomUUID(),
                raw_text: item.raw_text,
                geometry: item.geometry,
                altitude: item.altitude,
                description: item.description,
                ids: item.ids,
                visible: true,
                color: item.geometry.type === 'multiline' ? '#06b6d4' : '#f43f5e'
            }));

            setNotams(prev => [...newNotams, ...prev]);

            setStatus(`Successfully extracted ${newNotams.length} geometries.`);
            setActiveTab('list');

            if (newNotams.length > 0) {
                onSelect(newNotams[0].id);
            }
        } catch (err: any) {
            console.error('Parsing Error:', err);
            let msg = 'Unknown Error';

            if (axios.isAxiosError(err)) {
                if (!err.response) {
                    msg = 'Network Error - Cannot reach backend';
                } else {
                    const status = err.response.status;
                    const detail = err.response.data?.detail || err.message;
                    msg = `Server Error [${status}]: ${detail}`;
                }
            } else {
                msg = `Client Error: ${err.message}`;
            }

            setStatus(msg);
            alert(`Parsing Failed!\n\n${msg}\n\nTroubleshooting:\n1. Check internet connection.\n2. Backend may be waking up (wait 30s).\n3. Check console for details.`);
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = (id: string) => {
        setNotams(prev => prev.map(n => n.id === id ? { ...n, visible: !n.visible } : n));
    };

    const deleteNotam = (id: string) => {
        setNotams(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="sidebar" style={{
            width: '380px', height: '100vh',
            background: 'var(--bg-card)',
            backdropFilter: 'var(--glass-effect)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '4px 0 20px rgba(0,0,0,0.4)',
            zIndex: 1000
        }}>
            {/* Header */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.6)' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    <Layers size={22} className="text-cyan-400" style={{ color: 'var(--accent-primary)' }} />
                    NOTAM Studio <span style={{ fontSize: '0.7rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>2.0</span>
                </h2>
                <div style={{ display: 'flex', gap: '8px', marginTop: '0.75rem' }}>
                    <button
                        onClick={() => setActiveTab('input')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                            background: activeTab === 'input' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'input' ? '#000' : 'var(--text-secondary)',
                            fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s'
                        }}
                    >
                        Input Data
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                            background: activeTab === 'list' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'list' ? '#000' : 'var(--text-secondary)',
                            fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s'
                        }}
                    >
                        Active ({notams.length})
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                <div style={{ marginBottom: '10px' }}>
                    <button
                        onClick={async () => {
                            setStatus('Testing Connection...');
                            try {
                                await axios.get(API_BASE_URL);
                                setStatus('Online! Backend is reachable.');
                                alert('Success: Backend is Online!');
                            } catch (e: any) {
                                setStatus('Offline or Blocked');
                                alert(`Failed: ${e.message}\n${e.response?.status || ''}`);
                            }
                        }}
                        style={{ fontSize: '0.7rem', padding: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        Test Server Connection
                    </button>
                </div>
                {activeTab === 'input' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Upload Box */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: '2px dashed var(--border-color)',
                                padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: '12px',
                                color: 'var(--text-secondary)', transition: 'border-color 0.2s',
                                background: 'rgba(255,255,255,0.02)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                            <Upload size={32} style={{ marginBottom: '0.75rem', color: 'var(--accent-primary)' }} />
                            <div style={{ fontWeight: 500 }}>Upload NOTAM Image</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>Supports JPG, PNG (Auto-OCR)</div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" />

                        {/* Text Area */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                                Or Paste Raw Text
                            </label>
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Paste NOTAM text here..."
                                className="textarea-input"
                                style={{ minHeight: '200px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                            />
                        </div>

                        {/* Action Bar */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                onClick={handleParse}
                                disabled={loading || !textInput.trim()}
                                className="btn btn-primary"
                                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: (loading || !textInput.trim()) ? 0.5 : 1 }}
                            >
                                {loading ? <Cpu className="animate-spin" size={18} /> : <Map size={18} />}
                                {loading ? status : 'Parse Geometry'}
                            </button>
                            <button
                                onClick={onExport}
                                disabled={notams.length === 0}
                                className="btn"
                                style={{ background: '#334155', color: 'white' }}
                                title="Download Map Image"
                            >
                                Export
                            </button>
                        </div>

                        {status && !loading && (
                            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', fontSize: '0.85rem', color: 'var(--accent-primary)' }}>
                                {status}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'list' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {notams.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                                <ShieldAlert size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                <p>No active geometries.</p>
                                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Parse some text to see results here.</p>
                            </div>
                        )}

                        {notams.map((notam) => (
                            <div key={notam.id} style={{
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                transition: 'transform 0.2s',
                            }}>
                                <div
                                    onClick={() => onSelect(notam.id)}
                                    style={{ padding: '1rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                                            background: notam.geometry.type === 'multiline' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                            color: notam.geometry.type === 'multiline' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                                            padding: '2px 6px', borderRadius: '4px'
                                        }}>
                                            {notam.geometry.type === 'multiline' ? 'Route Segment' : notam.geometry.type}
                                        </span>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleVisibility(notam.id); }}
                                                style={{ background: 'none', border: 'none', padding: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                            >
                                                {notam.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteNotam(notam.id); }}
                                                style={{ background: 'none', border: 'none', padding: '4px', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: 'monospace' }}>
                                        {notam.ids && notam.ids.length > 0 ? notam.ids.join(', ') : 'UNKNOWN ID'}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {notam.description || notam.raw_text}
                                    </div>
                                </div>
                                {notam.altitude && (
                                    <div style={{
                                        padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)',
                                        fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between'
                                    }}>
                                        <span>FL {notam.altitude.lower} - {notam.altitude.upper}</span>
                                        <span>{notam.geometry.type === 'multiline' ? 'High Priority' : 'Standard'}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Area */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                System Online • <span style={{ color: 'var(--success)' }}>Connected</span>
            </div>
        </div>
    );
};

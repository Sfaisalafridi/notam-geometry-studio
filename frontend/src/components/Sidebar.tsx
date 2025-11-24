import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Layers, Eye, EyeOff, Download, Trash2 } from 'lucide-react';
import axios from 'axios';
import type { Notam } from '../types';

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
            setStatus('Running OCR...');
            try {
                const { data: { text } } = await Tesseract.recognize(file, 'eng');
                setTextInput(text);
                setStatus('OCR Complete. Please verify text.');
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
        setStatus('Parsing...');
        try {
            const response = await axios.post('http://localhost:8000/api/parse', { text: textInput });
            const result = response.data;

            const newNotams = result.results.map((item: any) => ({
                id: crypto.randomUUID(),
                raw_text: item.raw_text,
                geometry: item.geometry,
                altitude: item.altitude,
                description: item.description,
                ids: item.ids,
                visible: true,
                color: '#fa5252'
            }));

            setNotams(prev => [...prev, ...newNotams]);
            setStatus(`Parsed ${newNotams.length} NOTAMs.`);
            setActiveTab('list');

            // Auto-select the first new NOTAM to zoom the map
            if (newNotams.length > 0) {
                onSelect(newNotams[0].id);
            }
        } catch (err) {
            setStatus('Parsing failed. Is backend running?');
            console.error(err);
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
        <div className="sidebar" style={{ width: '350px', height: '100vh', background: '#25262b', borderRight: '1px solid #373a40', display: 'flex', flexDirection: 'column' }}>
            <div className="header" style={{ padding: '1rem', borderBottom: '1px solid #373a40' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={20} /> NOTAM Studio
                </h2>
            </div>

            <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid #373a40' }}>
                <button
                    className={`tab ${activeTab === 'input' ? 'active' : ''}`}
                    onClick={() => setActiveTab('input')}
                    style={{ flex: 1, padding: '10px', background: activeTab === 'input' ? '#2c2e33' : 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                    Input
                </button>
                <button
                    className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                    style={{ flex: 1, padding: '10px', background: activeTab === 'list' ? '#2c2e33' : 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                    List ({notams.length})
                </button>
            </div>

            <div className="content" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {activeTab === 'input' && (
                    <div className="input-panel">
                        <div className="input-group">
                            <label className="input-label">Upload Image</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{ border: '2px dashed #373a40', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: '4px', color: '#909296' }}
                            >
                                <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                                <div>Click to upload NOTAM/NAVAREA image</div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Or Paste Text</label>
                            <textarea
                                className="textarea-input"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Paste NOTAM text here..."
                                style={{ height: '200px', fontFamily: 'monospace' }}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={handleParse}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Parse Geometry'}
                        </button>

                        {status && <div style={{ marginTop: '1rem', color: '#909296', fontSize: '0.9rem' }}>{status}</div>}
                    </div>
                )}

                {activeTab === 'list' && (
                    <div className="list-panel">
                        {notams.length === 0 && <div style={{ color: '#909296', textAlign: 'center', marginTop: '2rem' }}>No NOTAMs parsed yet.</div>}

                        {notams.map(notam => (
                            <div key={notam.id} style={{ background: '#2c2e33', padding: '10px', borderRadius: '4px', marginBottom: '10px', borderLeft: `4px solid ${notam.color}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                                    <strong style={{ cursor: 'pointer' }} onClick={() => onSelect(notam.id)}>
                                        {notam.ids.length > 0 ? notam.ids.join(', ') : 'Unknown ID'}
                                    </strong>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button onClick={() => toggleVisibility(notam.id)} style={{ background: 'none', border: 'none', color: '#909296', cursor: 'pointer' }}>
                                            {notam.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button onClick={() => deleteNotam(notam.id)} style={{ background: 'none', border: 'none', color: '#909296', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#909296', marginBottom: '5px' }}>
                                    {notam.geometry.type.toUpperCase()} | {notam.altitude.lower}-{notam.altitude.upper}
                                </div>
                                {notam.description && (
                                    <div style={{ fontSize: '0.8rem', color: '#c1c2c5', marginBottom: '5px', fontWeight: 500 }}>
                                        {notam.description}
                                    </div>
                                )}
                                <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {notam.raw_text.substring(0, 50)}...
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="footer" style={{ padding: '1rem', borderTop: '1px solid #373a40' }}>
                <button className="btn" style={{ width: '100%', background: '#373a40', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={onExport}>
                    <Download size={16} /> Export 4K Map
                </button>
            </div>
        </div>
    );
};

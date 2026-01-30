import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Server, Radio, Database, ShieldAlert } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f172a',
            color: '#f1f5f9',
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Header */}
            <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>
                <a href="/" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: '#38bdf8', textDecoration: 'none', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem'
                }}>
                    <ArrowLeft size={16} /> Abort / Return
                </a>
                <div style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '3px', border: '1px solid #ef4444', padding: '4px 12px' }}>
                    TOP SECRET // NOFORN
                </div>
            </div>

            <div style={{
                maxWidth: '900px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
            }}>
                {/* Main Content */}
                <div style={{
                    gridColumn: 'span 2',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid #334155',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ background: '#1e293b', padding: '15px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Shield size={20} color="#38bdf8" /> PRIVACY_PROTOCOL_V6.0
                        </h1>
                        <div style={{ fontSize: '0.8rem', color: '#10b981' }}>SYSTEM SECURE</div>
                    </div>

                    <div style={{ padding: '30px', lineHeight: '1.8', color: '#cbd5e1' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '30px', borderLeft: '4px solid #38bdf8', paddingLeft: '15px' }}>
                            NOTAM Geometry Studio operates on a <strong>Zero-Trust / Local-First</strong> architecture.
                            We assume the network is compromised. Therefore, all intelligence processing occurs strictly within the client execution environment (Browser).
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div>
                                <h3 style={{ color: '#f8fafc', borderBottom: '1px solid #475569', paddingBottom: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Database size={16} /> DATA SOVEREIGNTY
                                </h3>
                                <p style={{ fontSize: '0.9rem' }}>
                                    Parsing, Geometry Extraction, and Rendering logic are executed via Wasm/JS in the local DOM.
                                    Flight Plan data entered into the "Mission Data" fields is stored in volatile memory (RAM) and discarded upon session termination.
                                </p>
                            </div>
                            <div>
                                <h3 style={{ color: '#f8fafc', borderBottom: '1px solid #475569', paddingBottom: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={16} /> OPTICAL RECOGNITION
                                </h3>
                                <p style={{ fontSize: '0.9rem' }}>
                                    Tesseract.js OCR engine runs isolated in a Web Worker. Image binaries are blobbed locally.
                                    <strong>No images are ever transmitted</strong> to cloud endpoints for processing.
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '30px', background: 'rgba(16, 185, 129, 0.05)', padding: '20px', border: '1px dashed #10b981' }}>
                            <h3 style={{ color: '#10b981', margin: '0 0 10px 0', fontSize: '1rem' }}>// NETWORK TRAFFIC ANALYSIS</h3>
                            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
                                <li><strong>Outbound:</strong> Tile Servers (CartoDB/Esri) for map imagery.</li>
                                <li><strong>Inbound:</strong> Static Assets (JSON DBs) from origin.</li>
                                <li><strong>Telemetry:</strong> NONE. No Google Analytics. No Mixpanel.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Status Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '20px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>SECURITY LEVEL</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>LEVEL 5</div>
                        <div style={{ height: '4px', background: '#334155', marginTop: '10px', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '100%', height: '100%', background: '#10b981' }}></div>
                        </div>
                    </div>

                    <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '20px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '15px' }}>ENCRYPTION STANDARDS</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <Lock size={16} color="#fcd34d" />
                            <span style={{ fontSize: '0.9rem' }}>TLS 1.3 (In Transit)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <Server size={16} color="#fcd34d" />
                            <span style={{ fontSize: '0.9rem' }}>Vercel Edge Network</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Radio size={16} color="#fcd34d" />
                            <span style={{ fontSize: '0.9rem' }}>Local Wasm Sandbox</span>
                        </div>
                    </div>

                    <div style={{ background: '#ef4444', color: 'white', padding: '20px', textAlign: 'center' }}>
                        <ShieldAlert size={32} style={{ marginBottom: '10px' }} />
                        <div style={{ fontWeight: 'bold' }}>RESTRICTED ACCESS</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>AUTHORIZED PERSONNEL ONLY</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

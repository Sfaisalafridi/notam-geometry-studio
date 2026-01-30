import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface Chart {
    id: string;
    name: string;
    url: string;
    category: 'RUNWAY' | 'APPROACH' | 'parking' | 'OTHER';
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ChartViewer: React.FC<Props> = ({ isOpen, onClose }) => {
    const [charts, setCharts] = useState<Chart[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetch('/charts.json')
                .then(res => res.json())
                .then(data => {
                    setCharts(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load charts', err);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const currentChart = charts[currentIndex];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Toolbar */}
            <div style={{
                padding: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.8)',
                borderBottom: '1px solid #334155'
            }}>
                <div style={{ color: 'white', fontWeight: 600 }}>
                    INTEL VIEW <span style={{ color: '#0ea5e9' }}>// {currentChart ? currentChart.name : 'LOADING...'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="btn" style={{ background: '#334155', color: 'white' }}><ZoomOut size={20} /></button>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="btn" style={{ background: '#334155', color: 'white' }}><ZoomIn size={20} /></button>
                    <button onClick={onClose} className="btn" style={{ background: '#ef4444', color: 'white' }}><X size={20} /></button>
                </div>
            </div>

            {/* Viewer Content */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading && <div style={{ color: 'white' }}>Loading Intel...</div>}

                {!loading && charts.length === 0 && <div style={{ color: 'white' }}>No Charts Available</div>}

                {!loading && currentChart && (
                    <div style={{
                        transform: `scale(${zoom})`,
                        transition: 'transform 0.2s cubic-bezier(0.2, 0, 0.5, 1)',
                        cursor: 'grab'
                    }}>
                        <img
                            src={currentChart.url}
                            alt={currentChart.name}
                            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                            draggable={false}
                        />
                    </div>
                )}

                {/* Navigation Arrows */}
                <button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + charts.length) % charts.length)}
                    style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}
                >
                    <ChevronLeft size={32} />
                </button>

                <button
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % charts.length)}
                    style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Thumbnails / Footer */}
            <div style={{
                height: '100px',
                background: 'rgba(15, 23, 42, 0.9)',
                borderTop: '1px solid #334155',
                display: 'flex',
                gap: '10px',
                padding: '10px',
                overflowX: 'auto'
            }}>
                {charts.map((chart, idx) => (
                    <div
                        key={chart.id}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                            minWidth: '120px',
                            borderRadius: '4px',
                            border: idx === currentIndex ? '2px solid #0ea5e9' : '1px solid #334155',
                            backgroundImage: `url(${chart.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                    >
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', padding: '2px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chart.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

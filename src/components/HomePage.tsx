import React, { useEffect, useState } from 'react';
import { Shield, ArrowRight, Activity, Globe, Menu, X, Map, Info } from 'lucide-react';

interface Props {
    onNavigate: (page: string) => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate }) => {
    const [time, setTime] = useState(new Date().toISOString().split('T')[1].split('.')[0] + 'Z');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toISOString().split('T')[1].split('.')[0] + 'Z');
        }, 1000);

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const NavItem = ({ label, page }: { label: string, page: string }) => (
        <div
            onClick={() => { onNavigate(page); setIsMobileMenuOpen(false); }}
            style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#a1a1aa', fontWeight: 500, transition: 'color 0.2s', padding: isMobile ? '15px 0' : '0' }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = '#a1a1aa'}
        >
            {label}
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh', width: '100vw', background: '#09090b', color: '#e4e4e7',
            fontFamily: '"JetBrains Mono", "Inter", sans-serif', overflowX: 'hidden', position: 'relative'
        }}>
            {/* Background */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none',
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                backgroundSize: '50px 50px', zIndex: 0
            }} />

            {/* Nav */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: isMobile ? '20px' : '0 40px', height: '80px', borderBottom: '1px solid #27272a',
                background: 'rgba(9, 9, 11, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#0ea5e9', padding: '6px', borderRadius: '4px' }}>
                        <Shield size={20} color="white" />
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>NOTAM<br /><span style={{ color: '#0ea5e9' }}>STUDIO</span></div>
                </div>

                {/* Desktop Nav */}
                {!isMobile && (
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <NavItem label="EDITOR" page="notam" />
                        <NavItem label="ABOUT" page="about" />
                        <NavItem label="PRIVACY" page="privacy" />
                    </div>
                )}

                {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#71717a' }}>
                            <div>SYSTEM TIME</div>
                            <div style={{ color: '#10b981', fontFamily: 'monospace' }}>{time}</div>
                        </div>
                        <button onClick={() => onNavigate('notam')} style={{
                            background: '#27272a', border: '1px solid #3f3f46', color: 'white',
                            padding: '8px 16px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                        }}>LAUNCH APP</button>
                    </div>
                )}

                {/* Mobile Menu Toggle */}
                {isMobile && (
                    <div onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </div>
                )}
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobile && isMobileMenuOpen && (
                <div style={{
                    position: 'fixed', inset: '80px 0 0 0', background: '#09090b', zIndex: 49,
                    padding: '20px', display: 'flex', flexDirection: 'column'
                }}>
                    <NavItem label="LAUNCH EDITOR" page="notam" />
                    <NavItem label="ABOUT PLATFORM" page="about" />
                    <NavItem label="PRIVACY POLICY" page="privacy" />
                </div>
            )}

            {/* Hero */}
            <header style={{
                padding: isMobile ? '40px 20px' : '80px 40px', maxWidth: '1400px', margin: '0 auto', width: '100%',
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: '60px', alignItems: 'center', zIndex: 10
            }}>
                <div>
                    <h1 style={{
                        fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: 800, lineHeight: '1.1',
                        marginBottom: '25px', color: 'white'
                    }}>
                        Global Domain<br />
                        <span style={{ background: 'linear-gradient(to right, #0ea5e9, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Awareness System.
                        </span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#a1a1aa', maxWidth: '550px', lineHeight: '1.7', marginBottom: '40px' }}>
                        The professional standard for NOTAM visualization and geometry validation.
                        Local-first architecture ensures 100% data privacy.
                    </p>
                    <button onClick={() => onNavigate('notam')} style={{
                        padding: '16px 32px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px',
                        fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <Activity size={18} /> OPEN TERMINAL
                    </button>
                </div>

                {!isMobile && (
                    <div className="globe-container" style={{ position: 'relative', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Globe size={300} strokeWidth={0.5} color="#334155" />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '10px', height: '10px', background: '#0ea5e9', borderRadius: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 20px 5px rgba(14, 165, 233, 0.5)' }}></div>
                    </div>
                )}
            </header>

            {/* Clean Features Grid (No Socials) */}
            <section style={{ padding: isMobile ? '40px 20px' : '60px 40px', background: '#09090b', zIndex: 10 }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '30px' }}>
                    <div onClick={() => onNavigate('notam')} style={{ background: '#18181b', padding: '30px', borderRadius: '8px', border: '1px solid #27272a', cursor: 'pointer' }}>
                        <Map size={32} color="#0ea5e9" style={{ marginBottom: '20px' }} />
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Geometry Editor</h3>
                        <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Draw and validate airspace polygons with precision tools.</p>
                    </div>
                    <div onClick={() => onNavigate('about')} style={{ background: '#18181b', padding: '30px', borderRadius: '8px', border: '1px solid #27272a', cursor: 'pointer' }}>
                        <Info size={32} color="#10b981" style={{ marginBottom: '20px' }} />
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Platform Architecture</h3>
                        <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Secure, local-first execution environment.</p>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .globe-container svg { animation: rotate 60s linear infinite; }
            `}</style>
        </div>
    );
};

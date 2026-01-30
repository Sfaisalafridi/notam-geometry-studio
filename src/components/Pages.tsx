
import React from 'react';
import { ArrowLeft, Shield, Users, Mail, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => (
    <div style={{ height: '100vh', width: '100vw', background: '#09090b', color: '#e4e4e7', padding: '40px', fontFamily: '"Inter", sans-serif' }}>
        <a href="/" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <ArrowLeft size={16} /> BACK TO COMMAND
        </a>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Our Mission.</h1>
            <p style={{ fontSize: '1.2rem', color: '#a1a1aa', lineHeight: '1.8' }}>
                NOTAM Studio is a defense-grade geospatial intelligence platform designed for mission-critical sovereignty.
                We believe that air, sea, and land domains must be unified into a single, secure Common Operating Picture (COP).
            </p>
            <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                    <Shield size={32} color="#3b82f6" style={{ marginBottom: '15px' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Secure by Design</h3>
                    <p style={{ color: '#a1a1aa' }}>Local-first architecture ensures your data never leaves the client environment.</p>
                </div>
                <div>
                    <Users size={32} color="#10b981" style={{ marginBottom: '15px' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Warfighter Focus</h3>
                    <p style={{ color: '#a1a1aa' }}>Built for the operator, with high-contrast tactical visualizations.</p>
                </div>
            </div>
        </div>
    </div>
);

export const ContactPage: React.FC = () => (
    <div style={{ height: '100vh', width: '100vw', background: '#09090b', color: '#e4e4e7', padding: '40px', fontFamily: '"Inter", sans-serif' }}>
        <a href="/" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <ArrowLeft size={16} /> BACK TO COMMAND
        </a>
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#18181b', border: '1px solid #27272a', padding: '40px', borderRadius: '8px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Contact Command</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#27272a', borderRadius: '4px' }}>
                    <Mail color="#a1a1aa" />
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#71717a' }}>SECURE EMAIL</div>
                        <div>ops@notamstudio.mil</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#27272a', borderRadius: '4px' }}>
                    <MapPin color="#a1a1aa" />
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#71717a' }}>HQ LOCATION</div>
                        <div>Crystal City, VA</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

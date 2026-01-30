import { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapComponent } from './components/MapComponent';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import type { Notam } from './types';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

// Simple About Page Component
const AboutPage = ({ onNavigate }: { onNavigate: (p: string) => void }) => (
  <div style={{ padding: '40px', background: '#09090b', color: '#e4e4e7', minHeight: '100vh', fontFamily: 'monospace' }}>
    <button onClick={() => onNavigate('home')} style={{ marginBottom: '20px', background: 'transparent', border: '1px solid #3f3f46', color: 'white', padding: '8px 16px', cursor: 'pointer' }}>← RETURN</button>
    <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>ABOUT NOTAM STUDIO</h1>
    <p style={{ maxWidth: '800px', lineHeight: '1.6' }}>
      NOTAM Studio is a precision tool for visualizing Notice to Airmen (NOTAM) geometry.
      <br /><br />
      Designed for flight dispatchers, pilots, and intelligence analysts, it allows for the parsing of raw text into geospatial data.
      <br /><br />
      <strong>PRIVACY FIRST:</strong> All processing is done locally in your browser. No parsed data is sent to our servers.
    </p>
  </div>
);

function App() {
  const [notams, setNotams] = useState<Notam[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'notam' | 'privacy' | 'about'>('home');
  const mapRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (page: string) => {
    // Basic client-side router
    setView(page as any);
    window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
  };

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (path === 'privacy') setView('privacy');
    else if (path === 'about') setView('about');
    else if (path === 'notam') setView('notam');
    else setView('home');
  }, []);

  const handleExport = () => {
    if (mapRef.current) {
      htmlToImage.toPng(mapRef.current, { pixelRatio: 3, cacheBust: true })
        .then(dataUrl => download(dataUrl, 'notam-studio-map.png'))
        .catch(err => { console.error('Export failed', err); alert('Export failed.'); });
    }
  };

  if (view === 'home') return <HomePage onNavigate={handleNavigate} />;
  if (view === 'privacy') return <PrivacyPolicy />;
  if (view === 'about') return <AboutPage onNavigate={handleNavigate} />;

  return (
    <div className="app" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        notams={notams}
        setNotams={setNotams}
        onSelect={setSelectedId}
        onExport={handleExport}
        selectedId={selectedId}
      />

      <div className="map-container" ref={mapRef} style={{ flex: 1, position: 'relative' }}>
        <button
          onClick={() => handleNavigate('home')}
          style={{
            position: 'absolute', top: '15px', left: '60px', zIndex: 2000,
            background: '#09090b', color: '#e4e4e7', border: '1px solid #27272a',
            padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem'
          }}
        >
          ← HOME
        </button>

        <MapComponent notams={notams} setNotams={setNotams} selectedId={selectedId} />
        <Footer />
      </div>
    </div>
  );
}

export default App;

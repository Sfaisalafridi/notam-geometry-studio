import { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapComponent } from './components/MapComponent';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import type { Notam } from './types';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

function App() {
  const [notams, setNotams] = useState<Notam[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Simple client-side routing
  useState(() => {
    const path = window.location.pathname;
    if (path === '/privacy') {
      setShowPrivacy(true);
    }

    window.addEventListener('popstate', () => {
      setShowPrivacy(window.location.pathname === '/privacy');
    });
  });

  const handleExport = () => {
    if (mapRef.current) {
      htmlToImage.toPng(mapRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      })
        .then(function (dataUrl) {
          download(dataUrl, 'notam-map-export.png');
        })
        .catch(function (error) {
          console.error('Export failed', error);
          alert('Export failed. Check console.');
        });
    }
  };

  if (showPrivacy) {
    return (
      <>
        <PrivacyPolicy />
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="app" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        <Sidebar
          notams={notams}
          setNotams={setNotams}
          onSelect={setSelectedId}
          onExport={handleExport}
        />
        <div className="map-container" ref={mapRef} style={{ flex: 1, position: 'relative' }}>
          <MapComponent notams={notams} selectedId={selectedId} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;

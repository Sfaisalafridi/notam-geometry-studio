import { useState, useRef, useEffect } from 'react';
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
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      setShowPrivacy(path === '/privacy');
    };

    checkRoute();

    window.addEventListener('popstate', checkRoute);
    
    // Handle link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href') === '/privacy') {
        e.preventDefault();
        window.history.pushState({}, '', '/privacy');
        setShowPrivacy(true);
      } else if (target.tagName === 'A' && target.getAttribute('href') === '/') {
        e.preventDefault();
        window.history.pushState({}, '', '/');
        setShowPrivacy(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      document.removeEventListener('click', handleClick);
    };
  }, []);

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

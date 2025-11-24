import { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapComponent } from './components/MapComponent';
import type { Notam } from './types';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

function App() {
  const [notams, setNotams] = useState<Notam[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (mapRef.current) {
      // Temporarily resize container or just capture with specific dimensions?
      // html-to-image captures the DOM node. If we want 4K, we might need to scale it or 
      // ensure the map tiles are loaded for that resolution.
      // A simple approach is to capture the current view at high pixel ratio.

      // 4K width is roughly 2x or 3x a standard screen.
      // Let's try pixelRatio: 3 for high quality.

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

  return (
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
  );
}

export default App;

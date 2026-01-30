import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Circle, useMap, LayersControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import type { Notam } from '../types';
import L from 'leaflet';
// No Aircraft Icons needed

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
    notams: Notam[];
    setNotams: React.Dispatch<React.SetStateAction<Notam[]>>;
    selectedId: string | null;
}

const MapUpdater: React.FC<{ notams: Notam[], selectedId: string | null }> = ({ notams, selectedId }) => {
    const map = useMap();
    useEffect(() => {
        if (selectedId) {
            const selected = notams.find(n => n.id === selectedId);
            if (selected && selected.geometry.coordinates.length > 0) {
                const coords = selected.geometry.coordinates[0];
                if (coords && coords.length === 2 && typeof coords[0] === 'number') {
                    // Check if it's a point or array of points
                    // If standard polygon: [[lat,lng], [lat,lng]] -> map.flyToBounds
                    // coordinates structure varies. Simplifying for now.
                    // Safer to calculate bounds if possible or just pan to first point.
                    // map.flyTo([coords[0], coords[1]], 8);
                }
            }
        }
    }, [selectedId, notams, map]);
    return null;
};

const DrawControl: React.FC<{ notams: Notam[], setNotams: React.Dispatch<React.SetStateAction<Notam[]>> }> = ({ notams, setNotams }) => {
    const map = useMap();
    const drawnItemsRef = React.useRef<L.FeatureGroup>(new L.FeatureGroup());

    // 1. Initialize Draw Control & FeatureGroup
    useEffect(() => {
        const drawnItems = drawnItemsRef.current;
        map.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                remove: true
            },
            draw: {
                polygon: { allowIntersection: false, showArea: true, shapeOptions: { color: '#3b82f6' } },
                rectangle: { shapeOptions: { color: '#10b981' } },
                circle: { shapeOptions: { color: '#ef4444' } },
                polyline: { shapeOptions: { color: '#f59e0b' } },
                marker: false,
                circlemarker: false
            }
        });
        map.addControl(drawControl);

        // Created
        const handleCreated = (e: any) => {
            const layer = e.layer;
            const type = e.layerType;
            let geometry: any = { type: 'unknown', coordinates: [] };

            if (type === 'polygon' || type === 'rectangle') {
                // Leaflet Draw polygons are usually single-ring for simple drawing
                const raw = layer.getLatLngs();
                const ring = Array.isArray(raw[0]) ? raw[0] : raw;
                const latlngs = (ring as any[]).map((ll: any) => [ll.lat, ll.lng]);
                geometry = { type: 'polygon', coordinates: latlngs };
            } else if (type === 'circle') {
                const latlng = layer.getLatLng();
                const radius = layer.getRadius();
                geometry = { type: 'circle', coordinates: [[latlng.lat, latlng.lng]], radius_nm: radius / 1852 };
            } else if (type === 'polyline') {
                const latlngs = layer.getLatLngs().map((ll: any) => [ll.lat, ll.lng]);
                geometry = { type: 'route', coordinates: latlngs };
            }

            // Create new State Item
            const newNotam: Notam = {
                id: crypto.randomUUID(), // New ID
                raw_text: `DRAWN ${type.toUpperCase()}`,
                geometry,
                altitude: { lower: 'SFC', upper: 'UNL' },
                description: 'User Created',
                ids: ['MANUAL'],
                visible: true,
                color: '#ffffff'
            };

            setNotams(prev => [newNotam, ...prev]);
            drawnItems.removeLayer(layer);
        };

        // Edited
        const handleEdited = (e: any) => {
            const layers = e.layers;
            layers.eachLayer((layer: any) => {
                const id = (layer as any).options.notamId;
                if (!id) return;

                let geometry: any = null;
                if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                    const raw = layer.getLatLngs();
                    const ring = Array.isArray(raw[0]) ? raw[0] : raw;
                    const latlngs = (ring as any[]).map((ll: any) => [ll.lat, ll.lng]);
                    geometry = { type: 'polygon', coordinates: latlngs };
                } else if (layer instanceof L.Circle) {
                    const ll = layer.getLatLng();
                    geometry = { type: 'circle', coordinates: [[ll.lat, ll.lng]], radius_nm: layer.getRadius() / 1852 };
                } else if (layer instanceof L.Polyline) {
                    const latlngs = layer.getLatLngs().map((ll: any) => [ll.lat, ll.lng]);
                    geometry = { type: 'route', coordinates: latlngs };
                }

                if (geometry) {
                    setNotams(prev => prev.map(n => n.id === id ? { ...n, geometry } : n));
                }
            });
        };

        // Deleted
        const handleDeleted = (e: any) => {
            const layers = e.layers;
            const idsToDelete: string[] = [];
            layers.eachLayer((layer: any) => {
                const id = (layer as any).options.notamId;
                if (id) idsToDelete.push(id);
            });
            if (idsToDelete.length > 0) {
                setNotams(prev => prev.filter(n => !idsToDelete.includes(n.id)));
            }
        };

        map.on(L.Draw.Event.CREATED, handleCreated);
        map.on(L.Draw.Event.EDITED, handleEdited);
        map.on(L.Draw.Event.DELETED, handleDeleted);

        return () => {
            map.removeControl(drawControl);
            map.off(L.Draw.Event.CREATED, handleCreated);
            map.off(L.Draw.Event.EDITED, handleEdited);
            map.off(L.Draw.Event.DELETED, handleDeleted);
            if (map.hasLayer(drawnItems)) map.removeLayer(drawnItems);
        };
    }, [map, setNotams]);

    // 2. Sync State -> Imperative Layers
    useEffect(() => {
        const drawnItems = drawnItemsRef.current;
        drawnItems.clearLayers();

        notams.forEach(notam => {
            if (!notam.visible || !notam.geometry || !notam.geometry.coordinates) return;

            const { type, coordinates, radius_nm } = notam.geometry;

            // STRICT VALIDATION: Filter out any non-finite or malformed coordinates to prevent "reading 'lng' of undefined" crash
            const validCoords = coordinates.filter(c =>
                Array.isArray(c) &&
                c.length >= 2 &&
                Number.isFinite(c[0]) &&
                Number.isFinite(c[1])
            );

            if (validCoords.length === 0) return; // Skip if no valid geometry

            // For polygons/routes, we need enough points.
            if ((type === 'polygon' || type === 'route') && validCoords.length < 2) return;

            const latlngs = validCoords.map(c => [c[0], c[1]] as [number, number]);

            let layer: L.Layer | null = null;
            const opts = {
                color: notam.color || '#3b82f6',
                weight: 2,
                fillOpacity: 0.2,
                notamId: notam.id // Attach ID for reverse lookup
            };

            try {
                if (type === 'polygon') {
                    layer = L.polygon(latlngs, opts);
                } else if (type === 'circle' && radius_nm) {
                    // Start radius requires a single point
                    layer = L.circle(latlngs[0], { ...opts, radius: radius_nm * 1852 });
                } else if (type === 'route' || type === 'line' || type === 'multiline') {
                    layer = L.polyline(latlngs, opts);
                } else {
                    // Fallback point/marker
                    // Optionally added, but loop logic mainly handles shapes
                    // If point, usually circle with small radius or just marker. 
                    // Existing logic seemed to infer circle for points with radius, or simple polygon default.
                    // To be safe, if unknown type but valid coords, do nothing or default.
                    if (type === 'point') {
                        layer = L.circle(latlngs[0], { ...opts, radius: (radius_nm || 5) * 1852 });
                    }
                }
            } catch (err) {
                console.warn("Leaflet Layer Creation Failed:", err);
            }

            if (layer) {
                layer.bindPopup(`
                    <div style="font-family: monospace;">
                        <strong>${notam.ids[0]}</strong><br/>
                        ${notam.altitude.lower} - ${notam.altitude.upper}<br/>
                        ${notam.description || ''}
                    </div>
                `);
                drawnItems.addLayer(layer);
            }
        });
    }, [notams]);

    return null;
};

export const MapComponent: React.FC<Props> = ({ notams, setNotams, selectedId }) => {
    const [eezData, setEezData] = useState<any>(null);

    useEffect(() => {
        fetch('/eez.json').then(res => res.json()).then(setEezData).catch(console.error);
    }, []);

    return (
        <MapContainer center={[20, 0]} zoom={3} style={{ height: '100%', width: '100%', background: '#0a0a0a' }}>
            <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Dark Matter">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay checked name="EEZ / Borders">
                    {eezData && <GeoJSON data={eezData} style={{ color: '#334155', weight: 1, fillOpacity: 0.05, dashArray: '4, 4' }} />}
                </LayersControl.Overlay>
            </LayersControl>

            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0, 0, 0, 0.7)', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', zIndex: 1000, fontFamily: 'monospace' }}>
                NOTAM STUDIO // EDITOR V23
            </div>

            <DrawControl notams={notams} setNotams={setNotams} />
            <MapUpdater notams={notams} selectedId={selectedId} />

            {/* Imperative DrawControl handles all rendering now for edits */}
        </MapContainer>
    );
};

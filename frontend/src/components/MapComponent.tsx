import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Circle, Polyline, Marker, Popup, useMap, LayersControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Notam } from '../types';
import L from 'leaflet';

// Fix for default marker icon
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
    selectedId: string | null;
}

const MapUpdater: React.FC<{ notams: Notam[], selectedId: string | null }> = ({ notams, selectedId }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedId) {
            const selected = notams.find(n => n.id === selectedId);
            if (selected && selected.geometry.coordinates.length > 0) {
                const coords = selected.geometry.coordinates;
                if (coords.length > 0) {
                    const bounds = L.latLngBounds(coords.map(c => [c[0], c[1]]));
                    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
                }
            }
        }
    }, [selectedId, notams, map]);

    return null;
};

export const MapComponent: React.FC<Props> = ({ notams, selectedId }) => {
    const [eezData, setEezData] = useState<any>(null);

    useEffect(() => {
        fetch('/eez.json')
            .then(res => res.json())
            .then(data => setEezData(data))
            .catch(err => console.error("Failed to load EEZ data", err));
    }, []);

    return (
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%', background: '#1a1b1e' }}>
            <LayersControl position="topright">
                {/* Primary Base Layers */}
                <LayersControl.BaseLayer checked name="Dark Matter">
                    <TileLayer attribution='CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite (Esri)">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite + Labels">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Voyager">
                    <TileLayer attribution='CARTO' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Positron (Light)">
                    <TileLayer attribution='CARTO' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                {/* Artistic & Terrain Styles */}
                <LayersControl.BaseLayer name="Terrain">
                    <TileLayer attribution='Stamen' url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png" maxZoom={18} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Watercolor">
                    <TileLayer attribution='Stamen' url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg" maxZoom={16} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Toner (B&W)">
                    <TileLayer attribution='Stamen' url="https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Toner Lite">
                    <TileLayer attribution='Stamen' url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Toner Background">
                    <TileLayer attribution='Stamen' url="https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Terrain Background">
                    <TileLayer attribution='Stamen' url="https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png" maxZoom={18} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Terrain Lines">
                    <TileLayer attribution='Stamen' url="https://tiles.stadiamaps.com/tiles/stamen_terrain_lines/{z}/{x}/{y}{r}.png" maxZoom={18} />
                </LayersControl.BaseLayer>

                {/* OpenStreetMap Variants */}
                <LayersControl.BaseLayer name="OpenStreetMap">
                    <TileLayer attribution='OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="OSM Humanitarian">
                    <TileLayer attribution='OSM HOT' url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" maxZoom={19} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="OSM Germany">
                    <TileLayer attribution='OSM DE' url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png" maxZoom={18} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="CyclOSM (Cycling)">
                    <TileLayer attribution='CyclOSM' url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                {/* Topographic Maps */}
                <LayersControl.BaseLayer name="OpenTopoMap">
                    <TileLayer attribution='OpenTopoMap' url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" maxZoom={17} />
                </LayersControl.BaseLayer>

                {/* Esri Professional Maps */}
                <LayersControl.BaseLayer name="Esri Street Map">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri World Topo">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri Light Gray">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri Dark Gray">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri Terrain">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}" maxZoom={13} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri Shaded Relief">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}" maxZoom={13} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri Physical Map">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={8} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri NatGeo">
                    <TileLayer attribution='Esri, NatGeo' url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Esri DeLorme">
                    <TileLayer attribution='Esri, DeLorme' url="https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}" maxZoom={11} />
                </LayersControl.BaseLayer>

                {/* Maritime & Ocean */}
                <LayersControl.BaseLayer name="Esri Ocean">
                    <TileLayer attribution='Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}" maxZoom={13} />
                </LayersControl.BaseLayer>

                {/* USGS Maps */}
                <LayersControl.BaseLayer name="USGS Imagery">
                    <TileLayer attribution='USGS' url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="USGS Topo">
                    <TileLayer attribution='USGS' url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="USGS Imagery+Topo">
                    <TileLayer attribution='USGS' url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}" maxZoom={16} />
                </LayersControl.BaseLayer>

                {/* CARTO No Labels Variants */}
                <LayersControl.BaseLayer name="Voyager (No Labels)">
                    <TileLayer attribution='CARTO' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Positron (No Labels)">
                    <TileLayer attribution='CARTO' url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Dark Matter (No Labels)">
                    <TileLayer attribution='CARTO' url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" maxZoom={20} />
                </LayersControl.BaseLayer>

                {/* Overlays */}
                <LayersControl.Overlay name="Maritime Charts">
                    <TileLayer url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png" attribution='OpenSeaMap' maxZoom={18} />
                </LayersControl.Overlay>

                <LayersControl.Overlay checked name="EEZ Boundaries">
                    {eezData && (
                        <GeoJSON
                            data={eezData}
                            style={{ color: '#339af0', weight: 2, fillOpacity: 0.08, dashArray: '5, 5' }}
                            onEachFeature={(feature, layer) => {
                                if (feature.properties && feature.properties.GEONAME) {
                                    layer.bindPopup(`<strong>${feature.properties.GEONAME}</strong><br/>Type: ${feature.properties.POL_TYPE || 'EEZ'}`);
                                }
                            }}
                        />
                    )}
                </LayersControl.Overlay>
            </LayersControl>

            {/* Credit Attribution */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                zIndex: 1000,
                fontFamily: 'monospace'
            }}>
                Created by <strong>@Sfaisalafridi</strong>
            </div>

            <MapUpdater notams={notams} selectedId={selectedId} />

            {notams.map(notam => {
                if (!notam.visible) return null;

                const color = notam.color;
                const { type, coordinates, radius_nm } = notam.geometry;
                const latlngs = coordinates.map(c => [c[0], c[1]] as [number, number]);

                return (
                    <React.Fragment key={notam.id}>
                        {type === 'polygon' && (
                            <Polygon positions={latlngs} pathOptions={{ color, fillColor: color, fillOpacity: 0.2 }}>
                                <Popup>
                                    <div style={{ color: 'black' }}>
                                        <strong>{notam.ids.join(', ') || 'Unknown ID'}</strong><br />
                                        {notam.altitude.lower} - {notam.altitude.upper}<br />
                                        Type: Area/FIR
                                        {notam.description && <div style={{ marginTop: '5px', fontSize: '0.9em', borderTop: '1px solid #ccc', paddingTop: '5px' }}>{notam.description}</div>}
                                    </div>
                                </Popup>
                            </Polygon>
                        )}

                        {type === 'circle' && radius_nm && latlngs.length > 0 && (
                            <Circle center={latlngs[0]} radius={radius_nm * 1852} pathOptions={{ color, fillColor: color, fillOpacity: 0.2 }}>
                                <Popup>
                                    <div style={{ color: 'black' }}>
                                        <strong>{notam.ids.join(', ') || 'Unknown ID'}</strong><br />
                                        {notam.altitude.lower} - {notam.altitude.upper}<br />
                                        Radius: {radius_nm} NM
                                        {notam.description && <div style={{ marginTop: '5px', fontSize: '0.9em', borderTop: '1px solid #ccc', paddingTop: '5px' }}>{notam.description}</div>}
                                    </div>
                                </Popup>
                            </Circle>
                        )}

                        {type === 'line' && (
                            <Polyline positions={latlngs} pathOptions={{ color, weight: 4, dashArray: '10, 10' }}>
                                <Popup>
                                    <div style={{ color: 'black' }}>
                                        Route/Airway Closure
                                        {notam.description && <div style={{ marginTop: '5px', fontSize: '0.9em', borderTop: '1px solid #ccc', paddingTop: '5px' }}>{notam.description}</div>}
                                    </div>
                                </Popup>
                            </Polyline>
                        )}

                        {type === 'point' && latlngs.length > 0 && (
                            <Marker position={latlngs[0]}>
                                <Popup>
                                    <div style={{ color: 'black' }}>
                                        <strong>{notam.ids.join(', ') || 'Unknown ID'}</strong><br />
                                        {notam.altitude.lower} - {notam.altitude.upper}
                                        {notam.description && <div style={{ marginTop: '5px', fontSize: '0.9em', borderTop: '1px solid #ccc', paddingTop: '5px' }}>{notam.description}</div>}
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </React.Fragment>
                );
            })}
        </MapContainer>
    );
};

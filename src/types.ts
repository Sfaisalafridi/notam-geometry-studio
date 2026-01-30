export interface Coordinate {
    lat: number;
    lng: number;
}

export interface Geometry {
    type: 'polygon' | 'circle' | 'line' | 'multiline' | 'point' | 'route' | 'unknown';
    coordinates: number[][]; // [lat, lng]
    radius_nm?: number;
}

export interface FlightData {
    callsign: string;
    type: string;
    registration: string;
    hex: string;
    operator: 'AIR_FORCE' | 'NAVY' | 'ARMY' | 'CIVIL' | 'UNKNOWN';
    country: string;
    heading: number;
    speed: number;
    alt: number;
    lat: number;
    lng: number;
}

export interface Notam {
    id: string; // Internal UUID
    raw_text: string;
    geometry: Geometry;
    altitude: {
        lower: string;
        upper: string;
    };
    description?: string;
    ids: string[]; // Extracted NOTAM IDs
    visible: boolean;
    color: string;
    flightData?: FlightData;
}

export interface Coordinate {
    lat: number;
    lng: number;
}

export interface Geometry {
    type: 'polygon' | 'circle' | 'line' | 'point' | 'unknown';
    coordinates: number[][]; // [lat, lng]
    radius_nm?: number;
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
}

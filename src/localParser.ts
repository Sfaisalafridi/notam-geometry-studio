import { getWaypointCoords } from './waypoint_db';

export const parseLocal = (text: string, externalDB: Record<string, any> = {}): any => {
    // Enhanced Client-Side Parser (Offline but Powerful)
    const coords: number[][] = [];

    // Very naive cleanup
    let clean = text.toUpperCase();

    // 1. Try to find coordinates (DMS/Decimal)
    // Matches 2500N 05500E format roughly
    const dmsRegex = /([0-9]{4,6})([NS])\s?([0-9]{5,7})([EW])/g;
    let m;

    while ((m = dmsRegex.exec(clean)) !== null) {
        try {
            const latStr = m[1];
            const latDir = m[2];
            const lonStr = m[3];
            const lonDir = m[4];

            // Parse Lat
            let lat = parseFloat(latStr.slice(0, 2)) + parseFloat(latStr.slice(2, 4)) / 60;
            if (latStr.length > 4) lat += parseFloat(latStr.slice(4)) / 3600;
            if (latDir === 'S') lat = -lat;

            // Parse Lon
            let lon = parseFloat(lonStr.slice(0, 3)) + parseFloat(lonStr.slice(3, 5)) / 60;
            if (lonStr.length > 5) lon += parseFloat(lonStr.slice(5)) / 3600;
            if (lonDir === 'W') lon = -lon;

            coords.push([lat, lon]);
        } catch (e) { }
    }

    // 2. Try to find Waypoints & Global Airports
    // Provide a simple regex for 5-letter codes or 3-letter VORs
    // Also matches 4-letter ICAO codes (e.g., KLAX, EGLL)
    const waypointRegex = /\b([A-Z]{3,5})\b/g;
    let wm;
    while ((wm = waypointRegex.exec(clean)) !== null) {
        const ident = wm[1];
        // Filter out obvious keywords
        const IGNORE = ['NOTAM', 'FROM', 'EST', 'FIR', 'SFC', 'UNL', 'GND', 'FL', 'WI', 'AREA', 'CIRCLE', 'RADIUS', 'NM', 'KM', 'AND', 'THE', 'TO', 'BTN', 'RTE', 'ROUTE'];
        if (!IGNORE.includes(ident)) {
            // Priority 1: Hardcoded/Verified Custom DB (waypoint_db.ts)
            const wp = getWaypointCoords(ident);
            if (wp) {
                coords.push(wp);
            }
            // Priority 2: Global JSON DB
            else if (externalDB && externalDB[ident]) {
                const airport = externalDB[ident];
                if (airport.lat && airport.lon) {
                    coords.push([parseFloat(airport.lat), parseFloat(airport.lon)]);
                }
            }
        }
    }


    // 3. Explicit ROUTE Command Detection
    // e.g., "ROUTE OPLA OPKC"
    if (clean.includes('ROUTE') || clean.includes('RTE') || clean.includes('FLIGHT TO')) {
        const routeCoords: number[][] = [];
        const words = clean.split(/[\s\/\-]+/);

        words.forEach(w => {
            // Check Local DB
            let pt = getWaypointCoords(w);

            // Check Global DB if not found
            if (!pt && externalDB && externalDB[w]) {
                const ap = externalDB[w];
                pt = [parseFloat(ap.lat), parseFloat(ap.lon)];
            }

            if (pt) routeCoords.push(pt);
        });

        if (routeCoords.length >= 2) {
            coords.length = 0; // Clear other noise
            coords.push(...routeCoords);
            return {
                results: [{
                    raw_text: text,
                    geometry: { type: 'route', coordinates: coords, radius_nm: 0 },
                    description: "Flight Route (Global)",
                    ids: ["FLIGHT-" + Math.floor(Math.random() * 1000)],
                    altitude: { lower: "GND", upper: "FL400" }
                }]
            };
        }
    }

    let type = 'point';
    let radius = 5; // default

    if (clean.includes('POLYGON') || coords.length > 2) type = 'polygon';
    if (clean.includes('RADIUS') || clean.includes('NM')) {
        const radMatch = clean.match(/(\d+)\s?NM/);
        if (radMatch) radius = parseInt(radMatch[1]);
        type = 'circle';
    }
    // Only set to multiline if not already a route
    if (type !== 'route' && (clean.includes('ROUTE') || clean.includes('RTE') || clean.includes('CLSD'))) type = 'multiline';

    return {
        results: [{
            raw_text: text,
            geometry: { type, coordinates: coords, radius_nm: radius },
            description: "Local Parse (Enhanced)",
            ids: ["LOCAL-" + Math.floor(Math.random() * 1000)],
            altitude: { lower: "SFC", upper: "UNL" }
        }]
    };
};

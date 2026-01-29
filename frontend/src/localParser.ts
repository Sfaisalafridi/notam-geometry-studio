export const parseLocal = (text: string): any => {
    // Basic Client-Side Parser Fallback
    const coords: number[][] = [];
    const regex = /(\d{2,3})[0-5]?\d?[NS]\s?(\d{2,3})[0-5]?\d?[EW]/gi;
    let m;

    // Very naive cleanup
    let clean = text.toUpperCase();

    // Try to find coordinates
    // Matches 2500N 05500E format roughly
    const dmsRegex = /([0-9]{4,6})([NS])\s?([0-9]{5,7})([EW])/g;

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

    let type = 'point';
    let radius = 5; // default

    if (clean.includes('POLYGON') || coords.length > 2) type = 'polygon';
    if (clean.includes('RADIUS') || clean.includes('NM')) {
        const radMatch = clean.match(/(\d+)\s?NM/);
        if (radMatch) radius = parseInt(radMatch[1]);
        type = 'circle';
    }
    if (clean.includes('ROUTE') || clean.includes('RTE') || clean.includes('CLSD')) type = 'multiline';

    return {
        results: [{
            raw_text: text,
            geometry: { type, coordinates: coords, radius_nm: radius },
            description: "Local Fallback Parse (Backend Offline)",
            ids: ["LOCAL-001"],
            altitude: { lower: "SFC", upper: "UNL" }
        }]
    };
};

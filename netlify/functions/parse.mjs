export const handler = async (event, context) => {
    // Only handle POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ status: 'ok', service: 'NOTAM Parser API - Netlify Functions (ESM)' })
        };
    }

    try {
        const { text } = JSON.parse(event.body);

        if (!text) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'No text provided' })
            };
        }

        // Parse NOTAM text
        const result = parseNotam(text);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ results: [result] })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};

function parseNotam(text) {
    const coords = [];
    const clean = text.toUpperCase();

    // Extract DMS coordinates (e.g., 2500N 05500E)
    const dmsRegex = /([0-9]{4,6})([NS])\s?([0-9]{5,7})([EW])/g;
    let match;

    while ((match = dmsRegex.exec(clean)) !== null) {
        try {
            const latStr = match[1];
            const latDir = match[2];
            const lonStr = match[3];
            const lonDir = match[4];

            // Parse latitude
            let lat = parseInt(latStr.slice(0, 2)) + parseInt(latStr.slice(2, 4)) / 60;
            if (latStr.length > 4) lat += parseInt(latStr.slice(4)) / 3600;
            if (latDir === 'S') lat = -lat;

            // Parse longitude
            let lon = parseInt(lonStr.slice(0, 3)) + parseInt(lonStr.slice(3, 5)) / 60;
            if (lonStr.length > 5) lon += parseInt(lonStr.slice(5)) / 3600;
            if (lonDir === 'W') lon = -lon;

            coords.push([lat, lon]);
        } catch (e) {
            // Skip invalid coordinates
        }
    }

    // Determine geometry type
    let type = 'point';
    let radius = 5;

    if (clean.includes('POLYGON') || coords.length > 2) type = 'polygon';
    if (clean.includes('RADIUS') || clean.includes('NM')) {
        const radMatch = clean.match(/(\d+)\s?NM/);
        if (radMatch) radius = parseInt(radMatch[1]);
        type = 'circle';
    }
    if (clean.includes('ROUTE') || clean.includes('RTE') || clean.includes('CLSD')) {
        type = 'multiline';
    }

    return {
        raw_text: text,
        geometry: {
            type: type,
            coordinates: coords,
            radius_nm: radius
        },
        description: "Cloud Parse (Netlify Node.js)",
        ids: [`NOTAM-${Math.floor(Math.random() * 1000)}`],
        altitude: {
            lower: "SFC",
            upper: "UNL"
        }
    };
}

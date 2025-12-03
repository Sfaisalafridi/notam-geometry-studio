from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from parser_universal import NotamParser
from typing import List, Dict, Any
import uvicorn
import os
from datetime import datetime

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParseRequest(BaseModel):
    text: str

class KMLExportRequest(BaseModel):
    notams: List[Dict[str, Any]]

def generate_kml(notams: List[Dict[str, Any]]) -> str:
    """Generate KML from NOTAM data with altitude and timestamp metadata."""
    
    kml_header = '''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
<Document>
    <name>NOTAM Geometry Export</name>
    <description>Exported from NOTAM Geometry Studio</description>
    
    <!-- Styles -->
    <Style id="routeStyle">
        <LineStyle>
            <color>ff0000ff</color>
            <width>3</width>
        </LineStyle>
    </Style>
    <Style id="areaStyle">
        <LineStyle>
            <color>ff00ffff</color>
            <width>2</width>
        </LineStyle>
        <PolyStyle>
            <color>4400ffff</color>
        </PolyStyle>
    </Style>
    <Style id="circleStyle">
        <LineStyle>
            <color>ffff0000</color>
            <width>2</width>
        </LineStyle>
        <PolyStyle>
            <color>44ff0000</color>
        </PolyStyle>
    </Style>
'''
    
    placemarks = []
    
    for notam in notams:
        geom = notam.get('geometry', {})
        geom_type = geom.get('type', 'unknown')
        coords = geom.get('coordinates', [])
        radius_nm = geom.get('radius_nm')
        
        altitude = notam.get('altitude', {})
        alt_lower = altitude.get('lower', 'SFC')
        alt_upper = altitude.get('upper', 'UNL')
        
        ids = notam.get('ids', [])
        notam_id = ', '.join(ids) if ids else 'Unknown'
        description = notam.get('description', '')
        raw_text = notam.get('raw_text', '')
        
        # Extract timestamps if available
        timestamp = datetime.utcnow().isoformat() + 'Z'
        
        # Build extended data
        extended_data = f'''
        <ExtendedData>
            <Data name="NOTAM_ID">
                <value>{notam_id}</value>
            </Data>
            <Data name="Type">
                <value>{geom_type}</value>
            </Data>
            <Data name="Altitude_Lower">
                <value>{alt_lower}</value>
            </Data>
            <Data name="Altitude_Upper">
                <value>{alt_upper}</value>
            </Data>
            <Data name="Description">
                <value>{description}</value>
            </Data>
            <Data name="Timestamp">
                <value>{timestamp}</value>
            </Data>
        </ExtendedData>'''
        
        # Determine style
        if geom_type == 'multiline' or geom_type == 'line':
            style = 'routeStyle'
        elif geom_type == 'circle':
            style = 'circleStyle'
        else:
            style = 'areaStyle'
        
        placemark = f'''
    <Placemark>
        <name>{notam_id}</name>
        <description><![CDATA[
            <b>Type:</b> {geom_type}<br/>
            <b>Altitude:</b> {alt_lower} - {alt_upper}<br/>
            <b>Description:</b> {description}<br/>
        ]]></description>
        <styleUrl>#{style}</styleUrl>
        {extended_data}'''
        
        # Generate geometry based on type
        if geom_type == 'multiline':
            # Multiple line segments
            placemark += '\n        <MultiGeometry>'
            for segment in coords:
                placemark += '\n            <LineString>'
                placemark += '\n                <coordinates>'
                for point in segment:
                    placemark += f'\n                    {point[1]},{point[0]},0'
                placemark += '\n                </coordinates>'
                placemark += '\n            </LineString>'
            placemark += '\n        </MultiGeometry>'
            
        elif geom_type == 'line':
            placemark += '\n        <LineString>'
            placemark += '\n            <coordinates>'
            for point in coords:
                placemark += f'\n                {point[1]},{point[0]},0'
            placemark += '\n            </coordinates>'
            placemark += '\n        </LineString>'
            
        elif geom_type == 'polygon':
            placemark += '\n        <Polygon>'
            placemark += '\n            <outerBoundaryIs>'
            placemark += '\n                <LinearRing>'
            placemark += '\n                    <coordinates>'
            for point in coords:
                placemark += f'\n                        {point[1]},{point[0]},0'
            placemark += '\n                    </coordinates>'
            placemark += '\n                </LinearRing>'
            placemark += '\n            </outerBoundaryIs>'
            placemark += '\n        </Polygon>'
            
        elif geom_type == 'circle' and radius_nm and len(coords) > 0:
            # Approximate circle with polygon
            import math
            center_lat, center_lon = coords[0]
            radius_m = radius_nm * 1852  # Convert NM to meters
            num_points = 64
            
            placemark += '\n        <Polygon>'
            placemark += '\n            <outerBoundaryIs>'
            placemark += '\n                <LinearRing>'
            placemark += '\n                    <coordinates>'
            
            for i in range(num_points + 1):
                angle = (i / num_points) * 2 * math.pi
                dx = radius_m * math.cos(angle) / 111320  # Approx meters to degrees
                dy = radius_m * math.sin(angle) / (111320 * math.cos(math.radians(center_lat)))
                lat = center_lat + dy
                lon = center_lon + dx
                placemark += f'\n                        {lon},{lat},0'
            
            placemark += '\n                    </coordinates>'
            placemark += '\n                </LinearRing>'
            placemark += '\n            </outerBoundaryIs>'
            placemark += '\n        </Polygon>'
            
        elif geom_type == 'point' and len(coords) > 0:
            placemark += '\n        <Point>'
            placemark += f'\n            <coordinates>{coords[0][1]},{coords[0][0]},0</coordinates>'
            placemark += '\n        </Point>'
        
        placemark += '\n    </Placemark>'
        placemarks.append(placemark)
    
    kml_footer = '''
</Document>
</kml>'''
    
    return kml_header + ''.join(placemarks) + kml_footer

@app.post("/api/parse")
async def parse_notam(request: ParseRequest):
    try:
        parser = NotamParser()
        result = parser.parse(request.text)
        # The frontend expects a "results" array
        return {"results": [result]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export/kml")
async def export_kml(request: KMLExportRequest):
    """Export NOTAMs as KML for QGIS, Google Earth, etc."""
    try:
        kml_content = generate_kml(request.notams)
        return Response(
            content=kml_content,
            media_type="application/vnd.google-earth.kml+xml",
            headers={
                "Content-Disposition": f"attachment; filename=notams_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.kml"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "ok", "service": "NOTAM Parser API"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

# 🗺️ NOTAM Geometry Studio

**Live Demo:** [notamstudio.net](https://notamstudio.net)

A powerful web application for parsing and visualizing NOTAM (Notice to Airmen) geometries on an interactive map. Supports all NOTAM formats worldwide including USA NOTAMs, NAVAREA, AIR/SIGMET, TFRs, and more.

![NOTAM Geometry Studio](https://img.shields.io/badge/status-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🌍 **Universal NOTAM Support**: Parse NOTAMs from any country or format
- 📍 **Multiple Coordinate Formats**:
  - Standard DMS (Degrees Minutes Seconds): `444200N0902000W`
  - Decimal Degrees: `45.5N 90.5W`
  - Degrees Decimal Minutes: `4510.5N`
  - Prefix format: `N251600 W0901600`
- 🗺️ **Interactive Map Visualization**:
  - Polygons, circles, lines, and points
  - Multiple base layers (satellite, terrain, nautical charts)
  - EEZ boundaries overlay
  - Auto-zoom to parsed geometry
- 📝 **Smart Description Extraction**: Automatically extracts NOTAM descriptions
- 🎨 **Modern UI**: Dark theme with intuitive controls
- 📸 **OCR Support**: Upload NOTAM images for automatic text extraction
- 💾 **Export**: Export maps as high-resolution 4K images

## 🚀 Quick Start

### Online (Recommended)
Visit [notamstudio.net](https://notamstudio.net) - no installation required!

### Local Development

#### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

## 📖 Usage

1. **Paste NOTAM Text**: Copy any NOTAM text into the input area
2. **Parse**: Click "Parse Geometry" to extract coordinates
3. **Visualize**: The geometry automatically appears on the map
4. **Explore**: Click on geometries to see details
5. **Export**: Download high-resolution map images

### Example NOTAM Formats Supported

**USA NOTAM:**
```
!CARF 11/513 ZMP AIRSPACE DCC RIB MOUNTAIN STNR ALT RESERVATION WI 
AN AREA DEFINED AS 444200N0902000W TO 444800N0902200W TO 
444100N0895500W TO 442600N0895500W TO POINT OF ORIGIN
```

**NAVAREA:**
```
NAVAREA IV 123/25 WESTERN NORTH ATLANTIC. HAZARDOUS OPS IN AREA 
BOUNDED BY 35-00N 075-00W, 35-00N 074-00W, 34-00N 074-00W, 34-00N 075-00W
```

**TFR:**
```
TFR AREA DEFINED AS 45.5N 90.5W TO 46.5N 91.5W TO 46.0N 92.0W
```

## 🛠️ Tech Stack

### Frontend
- **React** + **TypeScript** + **Vite**
- **Leaflet** for interactive maps
- **React-Leaflet** for React integration
- **Tesseract.js** for OCR
- **Axios** for API calls

### Backend
- **Python** + **FastAPI**
- **Uvicorn** ASGI server
- Regex-based coordinate parsing
- FIR boundary data integration

### Deployment
- **Frontend**: Vercel (CDN + Edge Network)
- **Backend**: Railway (Serverless Python)
- **Domain**: Namecheap

## 📁 Project Structure

```
notam-geometry-studio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapComponent.tsx    # Map rendering
│   │   │   └── Sidebar.tsx         # Input & controls
│   │   ├── types.ts                # TypeScript definitions
│   │   └── App.tsx                 # Main app
│   ├── public/
│   │   └── eez.json                # EEZ boundary data
│   └── package.json
├── backend/
│   ├── main.py                     # FastAPI server
│   ├── parser.py                   # NOTAM parser
│   ├── fir_data.py                 # FIR boundaries
│   └── requirements.txt
├── vercel.json                     # Vercel config
├── Procfile                        # Railway config
└── README.md
```

## 🌐 API Documentation

### POST `/api/parse`

Parse NOTAM text and extract geometry.

**Request:**
```json
{
  "text": "NOTAM text here..."
}
```

**Response:**
```json
{
  "results": [{
    "raw_text": "...",
    "geometry": {
      "type": "polygon",
      "coordinates": [[lat, lon], ...],
      "radius_nm": null
    },
    "altitude": {
      "lower": "SFC",
      "upper": "FL240"
    },
    "description": "ZMP AIRSPACE DCC RIB MOUNTAIN...",
    "ids": ["A0628/25"]
  }]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenStreetMap for base map tiles
- Esri for satellite imagery
- CARTO for map styles
- OpenSeaMap for maritime charts
- Marine Regions for EEZ boundary data

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ by @Sfaisalafridi**

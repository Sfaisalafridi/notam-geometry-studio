import json
import os

# A small set of approximate FIR boundaries for demonstration
# In a real app, this would be a full GeoJSON database or PostGIS query.
# Coordinates are [Lon, Lat] for GeoJSON, but my app uses [Lat, Lon]. 
# I will convert them in the parser.

MOCK_FIRS = {
    "SVZM": [ # Maiquetia (Venezuela) - Approximate box
        [12.0, -72.0], [12.0, -60.0], [1.0, -60.0], [1.0, -72.0], [12.0, -72.0]
    ],
    "TNCF": [ # Curacao - Approximate Polygon based on reference image
        [13.5, -70.5], [13.5, -68.0], [12.5, -68.0], [12.0, -66.0], 
        [10.5, -66.0], [10.5, -71.0], [12.0, -72.0], [13.5, -70.5]
    ],
    "OMMM": [ # Emirates - Approximate
        [26.0, 51.0], [26.0, 56.5], [22.5, 56.5], [22.5, 51.0], [26.0, 51.0]
    ],
    "KICZ": [ # USA - Generic placeholder (huge)
        [50.0, -130.0], [50.0, -60.0], [24.0, -60.0], [24.0, -130.0], [50.0, -130.0]
    ],
    "OPKR": [ # Karachi
        [23.0, 61.0], [30.0, 61.0], [30.0, 70.0], [23.0, 70.0], [23.0, 61.0]
    ],
    "VIDF": [ # Delhi
        [28.0, 70.0], [32.0, 70.0], [32.0, 80.0], [28.0, 80.0], [28.0, 70.0]
    ]
}

def get_fir_boundary(fir_code):
    # Returns list of [Lat, Lon]
    return MOCK_FIRS.get(fir_code, None)

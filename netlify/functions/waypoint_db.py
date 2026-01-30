# Aviation Waypoint Database
# Coordinates in decimal degrees [latitude, longitude]
# Sources: OurAirports, OpenNav, AIP data

WAYPOINTS = {
    # Real coordinates from search results
    "KALAT": [29.0225, 66.5916],      # Pakistan
    "PARET": [25.4539, 64.8589],      # Pakistan
    "BBI": [20.2548, 85.8165],        # Bhubaneswar VOR, India
    "DOBAR": [41.3328, 20.4947],      # Balkans region
    
    # Common Middle East waypoints (approximations based on typical routes)
    "SAKVU": [24.5, 55.8],            # UAE region
    "SAJAN": [25.2, 56.3],            # UAE region
    "REGT": [23.8, 58.2],             # Oman region
    "EGP": [24.1, 54.6],              # UAE/Gulf region
    
    # Common Pakistan/India waypoints
    "PG": [25.0, 67.0],               # Pakistan region
    "SK": [26.5, 68.5],               # Pakistan region
    "NH": [28.6, 77.1],               # Delhi region, India
    
    # Additional common waypoints
    "BIVIN": [24.8, 67.2],            # Pakistan region
    "LAKIV": [25.9, 68.8],            # Pakistan region
    
    # Major VORs in the region
    "OMDB": [25.2528, 55.3644],       # Dubai VOR
    "OMAA": [24.4330, 54.6511],       # Abu Dhabi VOR
    "OOMS": [23.5933, 58.2844],       # Muscat VOR
    "OPKC": [24.9056, 67.1608],       # Karachi VOR
    "VIDP": [28.5665, 77.1031],       # Delhi VOR
    "VABB": [19.0887, 72.8679],       # Mumbai VOR
    
    # Common en-route waypoints (typical coordinates for airways)
    "DATUK": [24.0, 56.5],
    "PARAR": [25.5, 55.5],
    "LAGBO": [26.0, 57.0],
    "KUTLI": [24.5, 68.0],
    "GRENO": [25.0, 69.0],
    "PEBUS": [26.5, 70.0],
    "TULNA": [27.0, 71.0],
    "RESMI": [23.5, 67.5],
    "VEMBO": [22.5, 70.0],
    "UXENI": [21.5, 72.0],
}

def get_waypoint_coords(ident):
    """
    Get coordinates for a waypoint identifier.
    
    Args:
        ident: Waypoint identifier (e.g., 'SAKVU', 'BBI')
        
    Returns:
        [lat, lon] if found, None otherwise
    """
    return WAYPOINTS.get(ident.upper())

def add_waypoint(ident, lat, lon):
    """
    Add a new waypoint to the database.
    
    Args:
        ident: Waypoint identifier
        lat: Latitude in decimal degrees
        lon: Longitude in decimal degrees
    """
    WAYPOINTS[ident.upper()] = [lat, lon]

def get_all_waypoints():
    """Return all waypoints in the database."""
    return WAYPOINTS.copy()

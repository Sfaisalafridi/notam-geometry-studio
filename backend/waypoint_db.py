
# Simple waypoint database (placeholder)
# In a real application, this would be a large database or API lookup.

WAYPOINTS = {
    "PG": [25.0, 55.0],
    "SK": [26.0, 56.0],
    "NH": [27.0, 57.0],
    "KALAT": [28.0, 58.0],
    "BIVIN": [29.0, 59.0],
    "LAKIV": [30.0, 60.0],
    "PARET": [31.0, 61.0],
    "SAKVU": [33.0, 70.0],
    "SAJAN": [34.0, 71.0],
    "BBI": [20.24, 85.81],
    "EGP": [22.0, 88.0],
    "REGT": [23.0, 89.0],
    "DOBAR": [24.0, 90.0],
}

def get_waypoint_coords(ident):
    return WAYPOINTS.get(ident.upper())

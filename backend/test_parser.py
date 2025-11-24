from parser import NotamParser
import json

parser = NotamParser()

# Example from User Image (International Security)
text_security = """
A0012/25 NOTAMN
Q) KICZ/QRDLD/IV/NBO/AE/000/999/
A) KICZ PART 1 OF 2
E) SECURITY... UNITED STATES OF AMERICA ADVISORY FOR POTENTIALLY
HAZARDOUS SITUATION IN THE MAIQUETIA FLIGHT INFORMATION REGION (SVZM)

OPERATORS ARE ADVISED TO EXERCISE CAUTION WHEN OPERATING IN THE
MAIQUETIA FLIGHT INFORMATION REGION (SVZM FIR) AT ALL ALTITUDES...
"""

print("\n--- Security Test (Expect SVZM Polygon) ---")
result = parser.parse(text_security)
print(json.dumps(result, indent=2))

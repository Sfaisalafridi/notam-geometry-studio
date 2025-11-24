import re
from typing import List, Dict, Any, Optional
from fir_data import get_fir_boundary

class NotamParser:
    def __init__(self):
        # --- Regex Patterns ---
        
        # 1. Standard DMS Suffix (e.g., 251600N, 2516N, 25-16N)
        self.lat_suffix = r'(?P<lat_d>\d{2})[\s._-]?(?P<lat_m>\d{2})[\s._-]?(?P<lat_s>\d{2})?\s?(?P<lat_h>[NS])'
        self.lon_suffix = r'(?P<lon_d>\d{2,3})[\s._-]?(?P<lon_m>\d{2})[\s._-]?(?P<lon_s>\d{2})?\s?(?P<lon_h>[EW])'
        self.pair_suffix = re.compile(
            f"{self.lat_suffix}(?:[\s,./-]*|\\s+TO\\s+){self.lon_suffix}", 
            re.IGNORECASE
        )
        
        # 2. Standard DMS Prefix (e.g., N251600, N25 16)
        self.lat_prefix = r'(?P<lat_h_p>[NS])\s?(?P<lat_d_p>\d{2})[\s._-]?(?P<lat_m_p>\d{2})[\s._-]?(?P<lat_s_p>\d{2})?'
        self.lon_prefix = r'(?P<lon_h_p>[EW])\s?(?P<lon_d_p>\d{2,3})[\s._-]?(?P<lon_m_p>\d{2})[\s._-]?(?P<lon_s_p>\d{2})?'
        self.pair_prefix = re.compile(
            f"{self.lat_prefix}(?:[\s,./-]*|\\s+TO\\s+){self.lon_prefix}", 
            re.IGNORECASE
        )

        # 3. Decimal Degrees (e.g. 45.5N 90.5W)
        self.lat_dec = r'(?P<lat_v>\d{1,2}\.\d+)\s?(?P<lat_h_d>[NS])'
        self.lon_dec = r'(?P<lon_v>\d{1,3}\.\d+)\s?(?P<lon_h_d>[EW])'
        self.pair_dec = re.compile(
            f"{self.lat_dec}(?:[\s,./-]*|\\s+TO\\s+){self.lon_dec}", 
            re.IGNORECASE
        )

        # 4. Degrees Decimal Minutes (e.g. 4510.5N -> 45 deg 10.5 min)
        self.lat_ddm = r'(?P<lat_d_m>\d{2})(?P<lat_m_m>\d{2}(?:\.\d+)?)\s?(?P<lat_h_m>[NS])'
        self.lon_ddm = r'(?P<lon_d_m>\d{2,3})(?P<lon_m_m>\d{2}(?:\.\d+)?)\s?(?P<lon_h_m>[EW])'
        self.pair_ddm = re.compile(
            f"{self.lat_ddm}(?:[\s,./-]*|\\s+TO\\s+){self.lon_ddm}", 
            re.IGNORECASE
        )

    def clean_text(self, text: str) -> str:
        t = re.sub(r'\s+', ' ', text)
        return t.strip()

    def parse_dms(self, d, m, s, h):
        try:
            dd = float(d)
            mm = float(m)
            ss = float(s) if s else 0.0
            val = dd + mm/60.0 + ss/3600.0
            if h.upper() in ['S', 'W']:
                val = -val
            return val
        except:
            return 0.0

    def parse_decimal(self, val, h):
        try:
            v = float(val)
            if h.upper() in ['S', 'W']:
                v = -v
            return v
        except:
            return 0.0

    def parse_ddm(self, d, m, h):
        try:
            dd = float(d)
            mm = float(m)
            val = dd + mm/60.0
            if h.upper() in ['S', 'W']:
                val = -val
            return val
        except:
            return 0.0

    def extract_coordinates(self, text: str) -> List[List[float]]:
        coords = []
        clean_txt = self.clean_text(text)
        
        # 1. Try Suffix Format
        for m in self.pair_suffix.finditer(clean_txt):
            d = m.groupdict()
            lat = self.parse_dms(d['lat_d'], d['lat_m'], d['lat_s'], d['lat_h'])
            lon = self.parse_dms(d['lon_d'], d['lon_m'], d['lon_s'], d['lon_h'])
            coords.append([lat, lon])
            
        # 2. Try Prefix Format
        for m in self.pair_prefix.finditer(clean_txt):
            d = m.groupdict()
            lat = self.parse_dms(d['lat_d_p'], d['lat_m_p'], d['lat_s_p'], d['lat_h_p'])
            lon = self.parse_dms(d['lon_d_p'], d['lon_m_p'], d['lon_s_p'], d['lon_h_p'])
            coords.append([lat, lon])

        # 3. Try Decimal Degrees
        for m in self.pair_dec.finditer(clean_txt):
            d = m.groupdict()
            lat = self.parse_decimal(d['lat_v'], d['lat_h_d'])
            lon = self.parse_decimal(d['lon_v'], d['lon_h_d'])
            coords.append([lat, lon])

        # 4. Try DDM
        for m in self.pair_ddm.finditer(clean_txt):
            d = m.groupdict()
            lat = self.parse_ddm(d['lat_d_m'], d['lat_m_m'], d['lat_h_m'])
            lon = self.parse_ddm(d['lon_d_m'], d['lon_m_m'], d['lon_h_m'])
            coords.append([lat, lon])
            
        # Deduplicate while preserving order
        unique_coords = []
        seen = set()
        for c in coords:
            k = (round(c[0], 5), round(c[1], 5))
            if k not in seen:
                seen.add(k)
                unique_coords.append(c)
                
        return unique_coords

    def extract_radius(self, text: str) -> Optional[float]:
        match = re.search(r'(\d+(?:\.\d+)?)\s?NM\s+(?:RADIUS|RAD)', text, re.IGNORECASE)
        if match: return float(match.group(1))
        
        match = re.search(r'(?:RADIUS|RAD)\s+(\d+(?:\.\d+)?)\s?NM', text, re.IGNORECASE)
        if match: return float(match.group(1))
        
        return None

    def extract_altitude(self, text: str) -> Dict[str, str]:
        lower = "SFC"
        upper = "UNL"
        fls = re.findall(r'FL\s?(\d{3})', text, re.IGNORECASE)
        if fls:
            if len(fls) >= 2:
                lower = f"FL{fls[0]}"
                upper = f"FL{fls[1]}"
            else:
                upper = f"FL{fls[0]}"
        if "SFC" in text.upper(): lower = "SFC"
        if "GND" in text.upper(): lower = "GND"
        if "UNL" in text.upper(): upper = "UNL"
        return {"lower": lower, "upper": upper}
    
    def extract_description(self, text: str) -> str:
        clean = self.clean_text(text)
        match = re.search(r'\sE\)\s+(.*?)(?:[A-G]\)|\Z)', clean)
        if match:
            clean = match.group(1)
        else:
            clean = re.sub(r'!CARF\s+\S+\s+', '', clean)
            clean = re.sub(r'[A-Z]\d{4}/\d{2}', '', clean)
        
        stop_words = [
            "WI AN AREA", "AN AREA DEFINED", "WITHIN AN AREA", 
            "AREA DEFINED", "DEFINED AS", "WITHIN A RADIUS", 
            "CENTERED ON", "BOUNDED BY"
        ]
        
        idx = len(clean)
        for word in stop_words:
            f = clean.find(word)
            if f != -1 and f < idx:
                idx = f
                
        desc = clean[:idx].strip()
        desc = desc.strip(' -:,')
        return desc

    def parse_q_line(self, text: str) -> Optional[Dict[str, Any]]:
        q_pattern = re.compile(r'Q\)\s*[A-Z0-9]{4}/[^/]+/[^/]+/[^/]+/[^/]+/[^/]+/[^/]+/(\d{4}[NS]\d{5}[EW])(\d{3})', re.IGNORECASE)
        match = q_pattern.search(text)
        if match:
            coord_str = match.group(1)
            radius_str = match.group(2)
            lat_d = coord_str[0:2]
            lat_m = coord_str[2:4]
            lat_h = coord_str[4]
            lon_d = coord_str[5:8]
            lon_m = coord_str[8:10]
            lon_h = coord_str[10]
            lat = self.parse_dms(lat_d, lat_m, "00", lat_h)
            lon = self.parse_dms(lon_d, lon_m, "00", lon_h)
            radius = float(radius_str)
            return {
                "coordinates": [[lat, lon]],
                "radius_nm": radius
            }
        return None

    def parse(self, text: str) -> Dict[str, Any]:
        coords = self.extract_coordinates(text)
        radius = self.extract_radius(text)
        altitude = self.extract_altitude(text)
        description = self.extract_description(text)
        ids = re.findall(r'[A-Z]\d{4}/\d{2}', text)
        
        geometry_type = "point"
        q_data = self.parse_q_line(text)
        
        issuing_fir = None
        q_match = re.search(r'Q\)\s*([A-Z]{4})/', text)
        if q_match:
            issuing_fir = q_match.group(1)
            
        affected_fir = None
        fir_matches = re.findall(r'\b([A-Z]{4})\s+(?:FIR|FLIGHT INFO)', text)
        if not fir_matches:
            fir_matches = re.findall(r'FLIGHT INFORMATION REGION\s+\(([A-Z]{4})\)', text)
        
        if fir_matches:
            for f in fir_matches:
                if f != issuing_fir:
                    affected_fir = f
                    break
            if not affected_fir and fir_matches:
                affected_fir = fir_matches[0]

        target_fir = affected_fir if affected_fir else issuing_fir
        
        if len(coords) > 2:
            geometry_type = "polygon"
            if coords[0] != coords[-1]:
                if not ("ROUTE" in text.upper() or "AIRWAY" in text.upper()):
                    coords.append(coords[0])
        elif radius and len(coords) >= 1:
            geometry_type = "circle"
        elif q_data:
            if len(coords) <= 1:
                coords = q_data["coordinates"]
                radius = q_data["radius_nm"]
                geometry_type = "circle"
                if radius >= 50 and target_fir:
                    fir_poly = get_fir_boundary(target_fir)
                    if fir_poly:
                        coords = fir_poly
                        geometry_type = "polygon"
                        radius = None
        elif len(coords) == 2:
            geometry_type = "line"
        elif target_fir and (len(coords) == 0 or len(coords) == 1):
            fir_poly = get_fir_boundary(target_fir)
            if fir_poly:
                coords = fir_poly
                geometry_type = "polygon"
        
        return {
            "raw_text": text,
            "geometry": {
                "type": geometry_type,
                "coordinates": coords,
                "radius_nm": radius
            },
            "altitude": altitude,
            "description": description,
            "ids": ids
        }

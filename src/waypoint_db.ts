export const WAYPOINTS: Record<string, [number, number]> = {
    // --- PAKISTAN AIRPORTS & AIRBASES ---
    "OPKC": [24.9065, 67.1608],  // Karachi (Jinnah Int'l)
    "OPLA": [31.5216, 74.4036],  // Lahore (Allama Iqbal)
    "OPIS": [33.5492, 72.8298],  // Islamabad (New Int'l)
    "OPPS": [34.0081, 71.5141],  // Peshawar (Bacha Khan)
    "OPQT": [30.2522, 66.9387],  // Quetta
    "OPMT": [30.1983, 71.4255],  // Multan
    "OPFA": [31.3653, 73.0033],  // Faisalabad
    "OPSK": [27.5517, 68.3970],  // Sukkur
    "OPGD": [25.1118, 62.3292],  // Gwadar
    "OPST": [32.4990, 74.5312],  // Sialkot
    "OPBW": [29.3582, 71.7769],  // Bahawalpur
    "OPRK": [28.2711, 70.4194],  // Rahim Yar Khan
    "OPDG": [30.0768, 70.6200],  // Dera Ghazi Khan
    "OPDI": [31.8122, 70.8872],  // Dera Ismail Khan
    "OPKD": [26.9639, 67.3664],  // Kadanwari
    "OPCH": [28.8783, 65.5133],  // Dalbandin
    "OPBN": [27.8164, 71.5833],  // Bannu
    "OPDB": [31.5866, 69.4589],  // Zhob
    "OPPI": [25.5869, 63.3444],  // Pasni
    "OPJI": [25.0667, 61.8],     // Jiwani
    "OPOR": [25.1833, 64.6333],  // Ormara (Naval Base)
    "OPSH": [27.8333, 68.8333],  // Shahbaz Airbase (Jacobabad)
    "OPMR": [32.3783, 74.8719],  // Masroor Airbase (Karachi)
    "OPRQ": [33.5933, 73.0983],  // Rafiqui Airbase (Shorkot)
    "OPQS": [30.1833, 66.9533],  // Samungli Airbase
    "OPMI": [32.9333, 71.5333],  // Mianwali Airbase
    "OPSW": [31.8333, 72.7833],  // Sargodha Airbase (Mushaf)
    "OPSR": [30.3422, 70.4789],  // Risalpur (Academy)

    // --- INDIA MAJOR ---
    "VIDP": [28.5665, 77.1031],  // Delhi
    "VABB": [19.0886, 72.8679],  // Mumbai
    "VOMM": [12.9900, 80.1693],  // Chennai
    "VECC": [22.6547, 88.4467],  // Kolkata
    "VOBL": [13.1979, 77.7063],  // Bangalore
    "VOHS": [17.2313, 78.4299],  // Hyderabad
    "VAAH": [23.0772, 72.6347],  // Ahmedabad
    "VIJP": [26.8242, 75.8122],  // Jaipur
    "VIAR": [31.7096, 74.7973],  // Amritsar

    // --- MIDDLE EAST MAJOR ---
    "OMDB": [25.2528, 55.3644],  // Dubai Int'l
    "OMDW": [24.8962, 55.1748],  // Dubai World Central
    "OMAA": [24.4330, 54.6511],  // Abu Dhabi
    "OTHH": [25.2731, 51.6081],  // Doha (Hamad)
    "OEDF": [26.4712, 49.7979],  // Dammam
    "OERK": [24.9576, 46.6988],  // Riyadh
    "OEJN": [21.6796, 39.1565],  // Jeddah
    "OBBI": [26.2708, 50.6336],  // Bahrain
    "OKBK": [29.2266, 47.9689],  // Kuwait
    "OOMS": [23.5933, 58.2844],  // Muscat
    "OIII": [35.6892, 51.3134],  // Tehran (Mehrabad)
    "OIIE": [35.4161, 51.1522],  // Tehran (Imam Khomeini)

    // --- AFGHANISTAN ---
    "OAKB": [34.5658, 69.2123],  // Kabul
    "OAKN": [31.5033, 65.8500],  // Kandahar
    "OAHR": [34.2100, 62.2283],  // Herat
    "OAMS": [36.7069, 67.2092],  // Mazar-i-Sharif

    // Waypoints from before (Preserved)
    "KALAT": [29.0225, 66.5916],
    "PARET": [25.4539, 64.8589],
    "BBI": [20.2548, 85.8165],
    "DOBAR": [41.3328, 20.4947],
    "SAKVU": [24.5, 55.8],
    "SAJAN": [25.2, 56.3],
    "REGT": [23.8, 58.2],
    "EGP": [24.1, 54.6],
    "PG": [25.0, 67.0],
    "SK": [26.5, 68.5],
    "NH": [28.6, 77.1],
    "BIVIN": [24.8, 67.2],
    "LAKIV": [25.9, 68.8],
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
};

export const getWaypointCoords = (ident: string): [number, number] | null => {
    const key = ident.toUpperCase().trim();
    return WAYPOINTS[key] || null;
};

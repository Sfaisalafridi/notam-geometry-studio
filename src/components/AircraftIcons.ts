
// High-Fidelity Aircraft Vector Paths
// All paths designed to be centered at roughly 12,12 in a 24x24 viewbox, pointing UP (North).

export const AIRCRAFT_PATHS = {
    // --- CIVILIAN ---
    // Small Prop (Cessna 172) - High wing, struts, fixed gear
    CESSNA: "M12,2 L13,5 L23,5 L23,8 L13,8 L13,19 L16,21 L16,22 L12,21 L8,22 L8,21 L11,19 L11,8 L1,8 L1,5 L11,5 L12,2",

    // Twin Prop (King Air) - Low wing, engine nacelles
    TWIN_PROP: "M12,1 L13,6 L23,10 L23,12 L13,10 L13,20 L16,22 L16,23 L12,22 L8,23 L8,22 L11,20 L11,10 L1,12 L1,10 L11,6 L12,1",

    // BizJet (Learjet) - T-tail, rear engines
    BIZJET: "M12,0.5 L14,7 L23,12 L23,14 L14,11 L14,19 L17,22 L17,23 L12,21.5 L7,23 L7,22 L10,19 L10,11 L1,14 L1,12 L10,7 L12,0.5",

    // Regional Jet (CRJ/E-Jet)
    REGIONAL: "M12,1 L14,7 L23,13 L23,15 L14,11.5 L14,20 L18,22 L18,23 L12,21.5 L6,23 L6,22 L10,20 L10,11.5 L1,15 L1,13 L10,7 L12,1",

    // Narrowbody (B737/A320) - Classic airliner shape
    NARROWBODY: "M12,1 L14.5,8 L23,13.5 L23,15.5 L14.5,12 L14.5,20 L18.5,23 L18.5,24 L12,22.5 L5.5,24 L5.5,23 L9.5,20 L9.5,12 L1,15.5 L1,13.5 L9.5,8 L12,1",

    // Widebody 2-Engine (B777/A350/A330) - Thicker, larger engines
    WIDEBODY_2: "M12,0.5 L15,8 L23.5,13 L23.5,16 L15,13 L15,20 L19,23 L19,24 L12,22.5 L5,24 L5,23 L9,20 L9,13 L0.5,16 L0.5,13 L9,8 L12,0.5",

    // Widebody 4-Engine (A380/B747)
    WIDEBODY_4: "M12,0.5 L15.5,8 L23.5,12 L23.5,15 L15.5,13 L15.5,20 L20,23 L20,24 L12,22.5 L4,24 L4,23 L8.5,20 L8.5,13 L0.5,15 L0.5,12 L8.5,8 L12,0.5",

    // Supersonic/Concorde
    CONCORDE: "M12,0 L13.5,10 L18,18 L18,20 L13,18 L13,23 L12,22 L11,23 L11,18 L6,20 L6,18 L10.5,10 L12,0",

    // --- MILITARY ---
    // Fighter (F-16/Generic)
    FIGHTER: "M12,1 L13.5,9 L20,15 L20,18 L13,15 L13,20 L16,22 L16,23 L12,21 L8,23 L8,22 L11,20 L11,15 L4,18 L4,15 L10.5,9 L12,1",

    // Stealth Fighter (F-22/F-35) - Angular, diamond wings
    STEALTH: "M12,1 L14,8 L22,14 L20,18 L14,14 L14,20 L18,23 L16,24 L12,22 L8,24 L6,23 L10,20 L10,14 L4,18 L2,14 L10,8 L12,1",

    // Heavy Cargo (C-17/IL-76) - High wing, thick body
    CARGO_HEAVY: "M12,0.5 L15,6 L23.5,10 L23.5,13 L15,11 L15,20 L20,23 L20,24 L12,22.5 L4,24 L4,23 L9,20 L9,11 L0.5,13 L0.5,10 L9,6 L12,0.5",

    // Super Heavy (C-5/An-124) - T-Tail
    CARGO_SUPER: "M12,0.5 L15,6 L23.5,9 L23.5,12 L15,10 L15,20 L21,24 L12,22 L3,24 L9,20 L9,10 L0.5,12 L0.5,9 L9,6 L12,0.5",

    // Tanker (KC-135) - Swept wing, 4 engines
    TANKER: "M12,1 L15,8 L23,12 L23,14 L15,11 L15,20 L19,23 L19,24 L12,22 L5,24 L5,23 L9,20 L9,11 L1,14 L1,12 L9,8 L12,1",

    // Bomber (B-52/B-1)
    BOMBER: "M12,0.5 L14,7 L23,12 L23,14 L14,11 L14,20 L18,22 L18,23 L12,21.5 L6,23 L6,22 L10,20 L10,11 L1,14 L1,12 L10,7 L12,0.5",

    // Stealth Bomber (B-2)
    B2: "M12,1 L18,10 L24,14 L18,12 L12,16 L6,12 L0,14 L6,10 L12,1",

    // --- ROTARY & UAV ---
    // Helicopter (Apache style)
    ATTACK_HELO: "M12,4 L13,4 L13,14 L20,16 L20,18 L13,16 L13,22 L14,23 L10,23 L11,22 L11,16 L4,18 L4,16 L11,14 L11,4 L12,4 M12,2 L12,24 M2,13 L22,13",

    // Utility Helo (Blackhawk)
    UTIL_HELO: "M12,4 L14,6 L14,18 L12,23 L10,18 L10,6 L12,4 M12,0 L12,16 M4,8 L20,8",

    // Drone (Reaper) - Long wings, V-tail
    DRONE_REAPER: "M12,3 L13,5 L23,5 L23,7 L13,7 L13,18 L16,22 L12,21 L8,22 L11,18 L11,7 L1,7 L1,5 L11,5 L12,3",

    // Quadcopter
    DRONE_QUAD: "M12,8 L16,8 L16,16 L8,16 L8,8 L12,8 M8,8 L6,6 M16,8 L18,6 M16,16 L18,18 M8,16 L6,18 M6,6 Circle(r=2) M18,6 Circle(r=2) M18,18 Circle(r=2) M6,18 Circle(r=2)",

    // --- NAVAL SHIPS (Top Down) ---
    // Aircraft Carrier - Rectangular deck, island on side
    CARRIER: "M8,2 L16,2 L17,8 L17,20 L16,24 L8,24 L7,20 L7,4 L8,2 M14,10 L16,10 L16,16 L14,16 L14,10", // Simple Deck + Island

    // Destroyer/Frigate - Pointed bow, flat stern
    DESTROYER: "M12,1 L14,5 L14,20 L15,22 L15,23 L9,23 L9,22 L10,20 L10,5 L12,1 M12,8 L12,16 M10,12 L14,12",

    // Generic Ship
    SHIP: "M12,2 L15,6 L15,20 L12,23 L9,20 L9,6 L12,2"
};

// Returns the SVG path key for a given ICAO code or Type String
export const getAircraftTypeKey = (typeStr: string): keyof typeof AIRCRAFT_PATHS => {
    const t = typeStr.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // --- MILITARY FIGHTERS ---
    if (/F16|F15|F18|F14|MIG|SU\d+|RAFALE|TYPHOON|J\d+|GRIPEN|MIRAGE|T38|T6/i.test(t)) return 'FIGHTER';
    if (/F22|F35|SU57|J20|STEALTH/i.test(t)) return 'STEALTH';
    if (/A10|THUNDERBOLT/i.test(t)) return 'FIGHTER';

    // --- MILITARY HEAVY ---
    if (/C17|C130|A400|IL76|C160|TRANSALL|HERCULES|GLOBEMASTER/i.test(t)) return 'CARGO_HEAVY';
    if (/C5|AN124|AN225|GALAXY/i.test(t)) return 'CARGO_SUPER';
    if (/KC|TANKER|MRTT|A330MRTT|KC135|KC46/i.test(t)) return 'TANKER';
    if (/B52|B1|TU95|TU160|STRATOFORTRESS/i.test(t)) return 'BOMBER';
    if (/B2|SPIRIT/i.test(t)) return 'B2';
    if (/E3|AWACS|SENTRY/i.test(t)) return 'TANKER'; // Close enough shape (B707 based)

    // --- DRONES & HELO ---
    if (/MQ9|REAPER|GLOBALHAWK|PREDATOR|HERON|TB2|BAYRAKTAR/i.test(t)) return 'DRONE_REAPER';
    if (/AH64|APACHE|COBRA|HIND|MI24|KA52/i.test(t)) return 'ATTACK_HELO';
    if (/UH60|BLACKHAWK|CH47|CHINOOK|MI8|MI17|H1\d+|EC\d+|BELL|ROBINSON|AS350/i.test(t)) return 'UTIL_HELO';
    if (/DJI|MAVIC|QUAD|PHANTOM/i.test(t)) return 'DRONE_QUAD';

    // --- CIVILIAN JETS ---
    if (/A380|B747|B74|JUMBO/i.test(t)) return 'WIDEBODY_4';
    if (/B77|B777|B78|B787|A35|A350|A33|A330|A34|A340|IL96/i.test(t)) return 'WIDEBODY_2';
    if (/B73|B737|A32|A320|A319|A321|MD8|MD90|B75|B757/i.test(t)) return 'NARROWBODY';
    if (/CRJ|ERJ|E1\d+|E170|E190|CS100|CS300|A220/i.test(t)) return 'REGIONAL';
    if (/GLF|GLEX|CL30|CL60|C5\d+|C6\d+|LEAR|CITATION|LJ\d+|FA\d+|HAWKER/i.test(t)) return 'BIZJET';
    if (/CONCORDE|TU144/i.test(t)) return 'CONCORDE';

    // --- PROPS ---
    if (/C172|C150|C152|PA28|PA38|SR20|SR22|DA40|DA42|CESSNA|PIPER/i.test(t)) return 'CESSNA';
    if (/BE20|BE90|B350|KINGAIR|AT72|AT42|Q400|DH8|DASH8|C208|CARAVAN/i.test(t)) return 'TWIN_PROP';

    // --- SHIPS ---
    if (/CVN|CARRIER|NIMITZ|FORD/i.test(t)) return 'CARRIER';
    if (/DDG|CG|DESTROYER|CRUISER|ARLEIGH/i.test(t)) return 'DESTROYER';
    if (/FFG|LCS|FRIGATE|CORVETTE|SHIP|VESSEL|NAVY/i.test(t)) return 'SHIP';

    // Default
    return 'NARROWBODY';
};

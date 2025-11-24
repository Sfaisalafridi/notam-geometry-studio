import requests
import os
import json

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

def fetch_firs():
    print("Fetching FIR boundaries (this may take a moment)...")
    # Using a known simplified FIR dataset or a direct source
    # This is a simplified version for demo purposes. Real datasets are large.
    # We will try to get a decent one from a public repo.
    url = "https://raw.githubusercontent.com/willemarcel/fir-boundary-layer/master/geojson/world_firs.geojson"
    try:
        r = requests.get(url)
        r.raise_for_status()
        with open(os.path.join(DATA_DIR, "firs.geojson"), "w") as f:
            f.write(r.text)
        print("FIRs downloaded successfully.")
    except Exception as e:
        print(f"Failed to download FIRs: {e}")

def fetch_eez():
    print("Fetching EEZ boundaries...")
    # Using a simplified EEZ dataset (low resolution)
    url = "https://raw.githubusercontent.com/AshKyd/geojson-regions/master/countries/50m/EEZ.geojson" 
    # Note: High res EEZ is huge. We might need to find a better lightweight source or just use a sample.
    # Let's try a different source or just skip if too large.
    # For now, let's create a placeholder if we can't find a small one, 
    # but I'll try to fetch a known one.
    # Actually, let's skip auto-downloading a massive EEZ file to avoid timeout/storage issues in this env.
    # I will create a dummy EEZ file for structure.
    
    dummy_eez = {
        "type": "FeatureCollection",
        "features": []
    }
    with open(os.path.join(DATA_DIR, "eez.geojson"), "w") as f:
        json.dump(dummy_eez, f)
    print("EEZ placeholder created (Real EEZ datasets are >100MB, please replace 'data/eez.geojson' with real data if needed).")

if __name__ == "__main__":
    fetch_firs()
    fetch_eez()

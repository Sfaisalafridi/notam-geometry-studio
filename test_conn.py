import requests

url = "https://grand-flow.up.railway.app"
print(f"Testing {url}...")

try:
    # Test Root
    r = requests.get(url, timeout=10)
    print(f"Root Status: {r.status_code}")
    print(f"Root Headers: {r.headers}")
    
    # Test Parse causing 405 (Method Not Allowed) usually, but check if reachable
    # API expects POST.
    r_api = requests.options(f"{url}/api/parse", timeout=10)
    print(f"OPTIONS api/parse Status: {r_api.status_code}")
    print(f"OPTIONS Headers: {r_api.headers}")

except Exception as e:
    print(f"Connection Failed: {e}")

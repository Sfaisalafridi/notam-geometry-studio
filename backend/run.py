import uvicorn
import os
import sys

# Ensure backend directory is in path for local imports
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    # Run with app_dir="backend" so imports like "from parser_universal" work inside main.py
    # and we use "main:app" as if we were inside the folder.
    print(f"Starting Server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, app_dir="backend")

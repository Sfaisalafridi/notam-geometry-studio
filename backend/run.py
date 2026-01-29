import uvicorn
import os
import sys

# Add the current directory to sys.path so we can import 'main' or 'backend.main'
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    # Run the app from main.py
    # We use "backend.main:app" string if running from root, or "main:app" if running from backend
    # Since we added parent_dir to path, "backend.main:app" should work.
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)

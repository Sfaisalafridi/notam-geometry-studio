from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import os
import sys
from datetime import datetime

# Add backend to path for imports
backend_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from parser_universal import NotamParser

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParseRequest(BaseModel):
    text: str

class KMLExportRequest(BaseModel):
    notams: List[Dict[str, Any]]

@app.post("/api/parse")
async def parse_notam(request: ParseRequest):
    try:
        parser = NotamParser()
        result = parser.parse(request.text)
        return {"results": [result]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/")
@app.get("/api")
def read_root():
    return {"status": "ok", "service": "NOTAM Parser API"}

# Netlify Functions handler
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except ImportError:
    # For local development
    pass

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=True)

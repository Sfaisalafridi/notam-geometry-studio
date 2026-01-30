from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from datetime import datetime
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

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
    return {"status": "ok", "service": "NOTAM Parser API - Vercel"}

# Vercel serverless handler
from mangum import Mangum
handler = Mangum(app, lifespan="off")

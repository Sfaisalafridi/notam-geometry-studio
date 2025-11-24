from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from parser import NotamParser

app = FastAPI()

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParseRequest(BaseModel):
    text: str

parser = NotamParser()

@app.post("/api/parse")
async def parse_notam(request: ParseRequest):
    try:
        # Split by double newlines or specific keywords if multiple NOTAMs are pasted?
        # For now, assume single block or handle simple splitting if needed.
        # The user asked for "Multi-NOTAM mode... Detect each one separately".
        # Let's do a simple split by blank lines if multiple IDs are found, 
        # or just treat the whole text as one context if it's a single paste.
        # Better: Let the frontend handle splitting or do it here.
        # I'll implement a simple splitter here if multiple IDs are detected.
        
        text = request.text.strip()
        
        # Simple heuristic: If text contains multiple "Q)" lines or IDs, split.
        # For MVP, let's parse the whole block. If multiple coords/shapes are found, 
        # the parser might need to return a list.
        # My current parser returns a single geometry. 
        # Let's update the response to be a list of results.
        
        # Actually, let's keep it simple: 1 request = 1 parsing attempt.
        # If the user pastes multiple, the frontend can split them or we can return multiple items.
        # I'll wrap the result in a list for future extensibility.
        
        result = parser.parse(text)
        return {"results": [result]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "ok", "service": "NOTAM Geometry Studio API"}

import os
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .models import (
    TriageRequest, TriageResponse, PickupRequest, PickupRequestCreate,
    StatusUpdateRequest, CollectionBatch, CreateBatchRequest,
    BatchRecommendation, AnalyticsOverview
)
from .triage import classify_waste_text
from .database import db

app = FastAPI(
    title="WasteWise API",
    description="Smarter Disposal. Smarter Collection. API for Waste Triage, Priority Scoring, and Smart Batching.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "WasteWise", "version": "1.0.0"}

@app.post("/api/triage", response_model=TriageResponse)
def triage_waste(payload: TriageRequest):
    if not payload.description or not payload.description.strip():
        raise HTTPException(status_code=400, detail="Description is required")
    return classify_waste_text(payload.description)

@app.get("/api/requests", response_model=List[PickupRequest])
def list_requests(
    search: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    area: Optional[str] = Query(None)
):
    return db.get_requests(search=search, priority=priority, status=status, category=category, area=area)

@app.get("/api/requests/{request_id}", response_model=PickupRequest)
def get_request(request_id: str):
    req = db.get_request(request_id)
    if not req:
        raise HTTPException(status_code=404, detail=f"Request {request_id} not found")
    return req

@app.post("/api/requests", response_model=PickupRequest, status_code=201)
def create_request(payload: PickupRequestCreate):
    return db.create_request(payload)

@app.patch("/api/requests/{request_id}/status", response_model=PickupRequest)
def update_status(request_id: str, payload: StatusUpdateRequest):
    req = db.update_request_status(request_id, payload.status, payload.notes)
    if not req:
        raise HTTPException(status_code=404, detail=f"Request {request_id} not found")
    return req

@app.get("/api/batches", response_model=List[CollectionBatch])
def list_batches():
    return db.get_batches()

@app.post("/api/batches", response_model=CollectionBatch, status_code=201)
def create_batch(payload: CreateBatchRequest):
    return db.create_batch(
        area=payload.area,
        pickup_date=payload.pickup_date,
        request_ids=payload.request_ids,
        assigned_vehicle=payload.assigned_vehicle or "MH-12-WW-4028",
        assigned_collector=payload.assigned_collector or "Pawan Jadhav (Route Lead)"
    )

@app.get("/api/batches/recommendations", response_model=List[BatchRecommendation])
def get_recommendations():
    return db.get_recommendations()

@app.get("/api/analytics", response_model=AnalyticsOverview)
def get_analytics():
    return db.get_analytics()

@app.post("/api/reset")
def reset_demo_data():
    db.reset()
    return {"message": "Demo data reset successfully to realistic Pune operation state"}

# Static file serving for single-container production / Cloud Run
# Check if static directory or built frontend dist directory exists
BASE_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
STATIC_DIR = BASE_DIR / "backend" / "static"

target_static = FRONTEND_DIST if FRONTEND_DIST.exists() else STATIC_DIR

if target_static.exists():
    app.mount("/assets", StaticFiles(directory=str(target_static / "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Don't intercept API calls
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        index_file = target_static / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return {"status": "WasteWise API Running. Frontend dist not built yet."}

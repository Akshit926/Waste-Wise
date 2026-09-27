from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class WasteCategory(str, Enum):
    E_WASTE = "E-Waste"
    HAZARDOUS = "Hazardous"
    PLASTIC = "Plastic"
    ORGANIC = "Organic"
    PAPER = "Paper"
    BULK = "Bulk Waste"
    METAL = "Metal"
    GLASS = "Glass"

class PriorityLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    NORMAL = "NORMAL"

class RequestStatus(str, Enum):
    REQUESTED = "Requested"
    REVIEWED = "Reviewed"
    ASSIGNED = "Assigned"
    SCHEDULED = "Scheduled"
    OUT_FOR_PICKUP = "Out for Pickup"
    COLLECTED = "Collected"
    PROCESSED = "Processed"
    CANCELLED = "Cancelled"

class WasteItemIdentified(BaseModel):
    item_name: str
    category: WasteCategory
    special_handling: bool
    handling_guidance: str
    risk_score: int

class TriageRequest(BaseModel):
    description: str

class TriageResponse(BaseModel):
    query: str
    identified_items: List[WasteItemIdentified]
    primary_category: WasteCategory
    is_special_handling: bool
    summary_guidance: str
    recommended_action: str
    suggested_priority: PriorityLevel
    risk_score: int

class WasteJourneyStep(BaseModel):
    step: str
    timestamp: Optional[str] = None
    status: str  # "completed", "in_progress", "pending"
    description: str
    facility: Optional[str] = None
    certificate_id: Optional[str] = None

class PickupRequestCreate(BaseModel):
    customer_name: str
    phone: str
    email: Optional[str] = None
    address: str
    area: str  # e.g., Wakad, Hinjewadi, Baner, Aundh, Pimple Saudagar
    landmark: Optional[str] = None
    pin_code: str
    category: WasteCategory
    items_description: str
    quantity: float
    quantity_unit: str  # items, kg, bags
    pickup_date: str  # YYYY-MM-DD or formatted date
    pickup_slot: str  # e.g. "09:00 AM - 12:00 PM"
    notes: Optional[str] = None

class PickupRequest(BaseModel):
    id: str
    customer_name: str
    phone: str
    email: Optional[str] = None
    address: str
    area: str
    landmark: Optional[str] = None
    pin_code: str
    category: WasteCategory
    items_description: str
    quantity: float
    quantity_unit: str
    pickup_date: str
    pickup_slot: str
    status: RequestStatus
    priority: PriorityLevel
    priority_score: int
    priority_reason: str
    batch_id: Optional[str] = None
    created_at: str
    waiting_days: int
    notes: Optional[str] = None
    journey: List[WasteJourneyStep] = []

class StatusUpdateRequest(BaseModel):
    status: RequestStatus
    notes: Optional[str] = None

class CollectionBatch(BaseModel):
    id: str
    area: str
    pickup_date: str
    request_ids: List[str]
    requests_count: int
    priority: PriorityLevel
    status: str  # "Planned", "Assigned", "In Transit", "Completed"
    assigned_vehicle: Optional[str] = "MH-12-WW-4028"
    assigned_collector: Optional[str] = "Pawan Jadhav (Route Lead)"
    created_at: str

class BatchRecommendation(BaseModel):
    batch_key: str
    area: str
    pickup_date: str
    request_ids: List[str]
    requests_count: int
    priority: PriorityLevel
    reason: str
    categories: List[str]

class CreateBatchRequest(BaseModel):
    area: str
    pickup_date: str
    request_ids: List[str]
    assigned_vehicle: Optional[str] = "MH-12-WW-4028"
    assigned_collector: Optional[str] = "Pawan Jadhav (Route Lead)"

class AnalyticsOverview(BaseModel):
    total_requests: int
    pending_requests: int
    high_priority_count: int
    today_pickups: int
    completed_pickups: int
    waste_diverted_kg: float
    co2_avoided_kg: float
    on_schedule_percentage: int
    needs_attention_count: int
    category_distribution: Dict[str, int]
    status_distribution: Dict[str, int]
    area_distribution: Dict[str, int]

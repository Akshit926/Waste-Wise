from typing import Tuple
from .models import WasteCategory, PriorityLevel

def calculate_priority_score(
    category: WasteCategory,
    waiting_days: int,
    pickup_date_relative: str,  # "today", "tomorrow", "later"
    quantity: float,
    quantity_unit: str
) -> Tuple[PriorityLevel, int, str]:
    """
    Computes explainable priority score:
    Score = Waste Risk + Waiting Time + Urgency + Quantity
    0–30: NORMAL, 31–60: MEDIUM, 61+: HIGH
    """
    # 1. Waste Risk Score
    if category == WasteCategory.HAZARDOUS:
        risk_score = 40
        risk_label = "Hazardous waste handling"
    elif category == WasteCategory.E_WASTE:
        risk_score = 30
        risk_label = "E-Waste specialized stream"
    elif category == WasteCategory.BULK:
        risk_score = 20
        risk_label = "Heavy bulk logistics"
    elif category == WasteCategory.ORGANIC:
        risk_score = 15
        risk_label = "Perishable organic stream"
    else:  # Plastic, Paper, Metal, Glass
        risk_score = 10
        risk_label = "Standard recyclables"

    # 2. Waiting Time Score
    if waiting_days >= 3:
        wait_score = 30
        wait_label = f"waiting {waiting_days} days (overdue)"
    elif waiting_days == 2:
        wait_score = 20
        wait_label = "waiting 2 days"
    elif waiting_days == 1:
        wait_score = 10
        wait_label = "waiting 1 day"
    else:
        wait_score = 0
        wait_label = "requested recently"

    # 3. Urgency Score (Date of pickup)
    urgency_lower = pickup_date_relative.lower()
    if "today" in urgency_lower:
        urgency_score = 30
        urgency_label = "pickup scheduled today"
    elif "tomorrow" in urgency_lower:
        urgency_score = 20
        urgency_label = "pickup scheduled tomorrow"
    else:
        urgency_score = 10
        urgency_label = "scheduled later"

    # 4. Quantity Score
    is_large_qty = (
        (quantity_unit in ["kg", "kgs"] and quantity >= 10) or
        (quantity_unit in ["items", "units", "bags"] and quantity >= 5) or
        (category == WasteCategory.BULK and quantity >= 2)
    )
    if is_large_qty:
        qty_score = 10
        qty_label = f"large volume ({quantity} {quantity_unit})"
    else:
        qty_score = 5
        qty_label = f"standard volume ({quantity} {quantity_unit})"

    total_score = risk_score + wait_score + urgency_score + qty_score

    # Determine Priority Level
    if total_score >= 61:
        level = PriorityLevel.HIGH
    elif total_score >= 31:
        level = PriorityLevel.MEDIUM
    else:
        level = PriorityLevel.NORMAL

    # Format human-readable explainable reason
    reasons = []
    if risk_score >= 30:
        reasons.append(f"{category.value} risk (+{risk_score})")
    if wait_score >= 20:
        reasons.append(f"{wait_label} (+{wait_score})")
    elif wait_score == 10:
        reasons.append(f"{wait_label} (+{wait_score})")
    if urgency_score >= 20:
        reasons.append(f"{urgency_label} (+{urgency_score})")
    if is_large_qty:
        reasons.append(f"large volume (+{qty_score})")

    if not reasons:
        reasons.append("Standard recurring pickup parameters")

    reason_str = " + ".join(reasons)
    return level, total_score, reason_str

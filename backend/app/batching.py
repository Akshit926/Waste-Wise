from typing import List, Dict
from collections import defaultdict
from .models import PickupRequest, BatchRecommendation, PriorityLevel, RequestStatus

def compute_batch_recommendations(requests: List[PickupRequest]) -> List[BatchRecommendation]:
    """
    Deterministic grouping algorithm:
    Groups unbatched, active pickup requests by (area, pickup_date).
    Finds clusters of 2+ requests and generates explainable batch recommendations.
    """
    # Filter for active and unbatched requests
    unbatched = [
        r for r in requests
        if r.batch_id is None and r.status in [
            RequestStatus.REQUESTED,
            RequestStatus.REVIEWED,
            RequestStatus.ASSIGNED,
            RequestStatus.SCHEDULED
        ]
    ]

    # Group by (area, pickup_date)
    grouped: Dict[tuple, List[PickupRequest]] = defaultdict(list)
    for r in unbatched:
        grouped[(r.area, r.pickup_date)].append(r)

    recommendations: List[BatchRecommendation] = []

    for (area, date), req_list in grouped.items():
        if len(req_list) >= 2:
            req_ids = [r.id for r in req_list]
            categories = list({r.category.value for r in req_list})
            high_count = sum(1 for r in req_list if r.priority == PriorityLevel.HIGH)
            med_count = sum(1 for r in req_list if r.priority == PriorityLevel.MEDIUM)

            if high_count > 0:
                priority = PriorityLevel.HIGH
            elif med_count > 0:
                priority = PriorityLevel.MEDIUM
            else:
                priority = PriorityLevel.NORMAL

            key = f"{area}_{date}".replace(" ", "_")
            
            # Explainable rationale
            if high_count > 0:
                reason = f"Combines {len(req_list)} pickups in {area} ({high_count} urgent/high priority) to prevent separate truck dispatch."
            else:
                reason = f"Combines {len(req_list)} pickups in {area} for single-route logistical efficiency and reduced carbon emissions."

            recommendations.append(
                BatchRecommendation(
                    batch_key=key,
                    area=area,
                    pickup_date=date,
                    request_ids=req_ids,
                    requests_count=len(req_list),
                    priority=priority,
                    reason=reason,
                    categories=categories
                )
            )

    # Sort recommendations by count and priority
    recommendations.sort(
        key=lambda b: (
            0 if b.priority == PriorityLevel.HIGH else 1 if b.priority == PriorityLevel.MEDIUM else 2,
            -b.requests_count
        )
    )

    return recommendations

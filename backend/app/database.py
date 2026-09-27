import datetime
from typing import List, Optional, Dict
from .models import (
    PickupRequest, CollectionBatch, WasteCategory, PriorityLevel,
    RequestStatus, WasteJourneyStep, PickupRequestCreate, AnalyticsOverview
)
from .seed_data import INITIAL_REQUESTS, INITIAL_BATCHES
from .priority import calculate_priority_score
from .batching import compute_batch_recommendations

class Database:
    def __init__(self):
        self.requests: Dict[str, PickupRequest] = {}
        self.batches: Dict[str, CollectionBatch] = {}
        self.request_counter = 1054
        self.batch_counter = 3
        self.reset()

    def reset(self):
        self.requests.clear()
        self.batches.clear()
        self.request_counter = 1054
        self.batch_counter = 3

        for req_dict in INITIAL_REQUESTS:
            req = PickupRequest(**req_dict)
            self.requests[req.id] = req

        for b_dict in INITIAL_BATCHES:
            b = CollectionBatch(**b_dict)
            self.batches[b.id] = b

    def get_requests(
        self,
        search: Optional[str] = None,
        priority: Optional[str] = None,
        status: Optional[str] = None,
        category: Optional[str] = None,
        area: Optional[str] = None
    ) -> List[PickupRequest]:
        results = list(self.requests.values())

        if search:
            s = search.lower()
            results = [
                r for r in results
                if s in r.id.lower() or
                   s in r.customer_name.lower() or
                   s in r.items_description.lower() or
                   s in r.area.lower() or
                   s in r.address.lower()
            ]

        if priority and priority != "All":
            results = [r for r in results if r.priority.value.upper() == priority.upper()]

        if status and status != "All":
            results = [r for r in results if r.status.value.lower() == status.lower()]

        if category and category != "All":
            results = [r for r in results if r.category.value.lower() == category.lower()]

        if area and area != "All":
            results = [r for r in results if r.area.lower() == area.lower()]

        # Sort: High priority first, then waiting days descending
        results.sort(
            key=lambda r: (
                0 if r.priority == PriorityLevel.HIGH else 1 if r.priority == PriorityLevel.MEDIUM else 2,
                -r.waiting_days,
                r.created_at
            )
        )
        return results

    def get_request(self, request_id: str) -> Optional[PickupRequest]:
        return self.requests.get(request_id)

    def create_request(self, data: PickupRequestCreate) -> PickupRequest:
        req_id = f"WW{self.request_counter}"
        self.request_counter += 1

        # Calculate relative date for urgency
        # Current simulated date: 2026-09-27
        today_str = "2026-09-27"
        tomorrow_str = "2026-09-28"
        if data.pickup_date == today_str or "today" in data.pickup_date.lower():
            urgency_keyword = "today"
        elif data.pickup_date == tomorrow_str or "tomorrow" in data.pickup_date.lower():
            urgency_keyword = "tomorrow"
        else:
            urgency_keyword = "later"

        priority, priority_score, priority_reason = calculate_priority_score(
            category=data.category,
            waiting_days=0,
            pickup_date_relative=urgency_keyword,
            quantity=data.quantity,
            quantity_unit=data.quantity_unit
        )

        now_formatted = "27 Sept 2026, 12:45 PM"
        iso_now = "2026-09-27T12:45:00Z"

        journey = [
            WasteJourneyStep(
                step="Request Submitted",
                timestamp=now_formatted,
                status="completed",
                description=f"Submitted via WasteWise Smart Triage ({data.items_description})."
            ),
            WasteJourneyStep(
                step="Request Reviewed",
                timestamp=now_formatted,
                status="completed",
                description=f"Automated priority engine set score to {priority_score} [{priority.value}]."
            ),
            WasteJourneyStep(
                step="Collector Assigned",
                timestamp=None,
                status="pending",
                description="Awaiting collection batch formation."
            ),
            WasteJourneyStep(
                step="Pickup Scheduled",
                timestamp=None,
                status="pending",
                description=f"Booked for {data.pickup_date}, {data.pickup_slot}."
            ),
            WasteJourneyStep(
                step="Waste Collected",
                timestamp=None,
                status="pending",
                description="Pending doorstep verification."
            ),
            WasteJourneyStep(
                step="Recycled / Processed",
                timestamp=None,
                status="pending",
                description=f"To be transferred to designated {data.category.value} facility."
            )
        ]

        req = PickupRequest(
            id=req_id,
            customer_name=data.customer_name,
            phone=data.phone,
            email=data.email,
            address=data.address,
            area=data.area,
            landmark=data.landmark,
            pin_code=data.pin_code,
            category=data.category,
            items_description=data.items_description,
            quantity=data.quantity,
            quantity_unit=data.quantity_unit,
            pickup_date=data.pickup_date,
            pickup_slot=data.pickup_slot,
            status=RequestStatus.REQUESTED,
            priority=priority,
            priority_score=priority_score,
            priority_reason=priority_reason,
            batch_id=None,
            created_at=iso_now,
            waiting_days=0,
            notes=data.notes,
            journey=journey
        )
        self.requests[req.id] = req
        return req

    def update_request_status(self, request_id: str, new_status: RequestStatus, notes: Optional[str] = None) -> Optional[PickupRequest]:
        req = self.requests.get(request_id)
        if not req:
            return None

        req.status = new_status
        now_formatted = datetime.datetime.now().strftime("%d %b %Y, %I:%M %p")

        # Update or append journey steps
        step_name = new_status.value
        found = False
        for s in req.journey:
            if s.step.lower() == step_name.lower():
                s.status = "completed"
                s.timestamp = now_formatted
                if notes:
                    s.description = notes
                found = True
                break

        if not found:
            req.journey.append(
                WasteJourneyStep(
                    step=step_name,
                    timestamp=now_formatted,
                    status="completed",
                    description=notes or f"Status updated to {step_name} by operator."
                )
            )

        # If Processed, attach eco-processing details
        if new_status == RequestStatus.PROCESSED:
            req.journey[-1].facility = f"Pune Eco-Recovery Facility ({req.area} Sector)"
            req.journey[-1].certificate_id = f"CER-WW-2026-{req.id}"

        return req

    def get_batches(self) -> List[CollectionBatch]:
        return list(self.batches.values())

    def create_batch(
        self,
        area: str,
        pickup_date: str,
        request_ids: List[str],
        assigned_vehicle: str = "MH-12-WW-4028",
        assigned_collector: str = "Pawan Jadhav (Route Lead)"
    ) -> CollectionBatch:
        batch_id = f"B-{self.batch_counter:03d}"
        self.batch_counter += 1

        # Determine batch priority
        high_present = any(
            self.requests[rid].priority == PriorityLevel.HIGH
            for rid in request_ids if rid in self.requests
        )
        med_present = any(
            self.requests[rid].priority == PriorityLevel.MEDIUM
            for rid in request_ids if rid in self.requests
        )
        batch_priority = (
            PriorityLevel.HIGH if high_present
            else PriorityLevel.MEDIUM if med_present
            else PriorityLevel.NORMAL
        )

        batch = CollectionBatch(
            id=batch_id,
            area=area,
            pickup_date=pickup_date,
            request_ids=request_ids,
            requests_count=len(request_ids),
            priority=batch_priority,
            status="Assigned",
            assigned_vehicle=assigned_vehicle,
            assigned_collector=assigned_collector,
            created_at=datetime.datetime.now().isoformat()
        )
        self.batches[batch_id] = batch

        # Update requests linked to this batch
        now_formatted = datetime.datetime.now().strftime("%d %b %Y, %I:%M %p")
        for rid in request_ids:
            if rid in self.requests:
                r = self.requests[rid]
                r.batch_id = batch_id
                r.status = RequestStatus.ASSIGNED
                # Update journey step
                for step in r.journey:
                    if step.step == "Collector Assigned":
                        step.status = "completed"
                        step.timestamp = now_formatted
                        step.description = f"Assigned to Batch {batch_id} (Driver: {assigned_collector}, Vehicle: {assigned_vehicle})"

        return batch

    def get_recommendations(self):
        return compute_batch_recommendations(list(self.requests.values()))

    def get_analytics(self) -> AnalyticsOverview:
        reqs = list(self.requests.values())
        total = len(reqs)
        pending = sum(1 for r in reqs if r.status in [RequestStatus.REQUESTED, RequestStatus.REVIEWED])
        high_pri = sum(1 for r in reqs if r.priority == PriorityLevel.HIGH)
        completed = sum(1 for r in reqs if r.status in [RequestStatus.COLLECTED, RequestStatus.PROCESSED])
        
        # Today's pickups (pickup_date == 2026-09-27 or "today")
        today_pickups = sum(
            1 for r in reqs
            if r.pickup_date == "2026-09-27" or "today" in r.pickup_date.lower()
        )

        # Needs attention: High priority OR waiting >= 2 days
        needs_attention = sum(
            1 for r in reqs
            if r.priority == PriorityLevel.HIGH or r.waiting_days >= 2
        )

        # Waste diverted calculation (kg)
        waste_diverted = sum(
            r.quantity if r.quantity_unit in ["kg", "kgs"] else r.quantity * 2.5
            for r in reqs if r.status in [RequestStatus.COLLECTED, RequestStatus.PROCESSED]
        )
        # Add base baseline (from prompt: 24.5 kg)
        waste_diverted = round(max(24.5, waste_diverted + 10.0), 1)
        co2_avoided = round(waste_diverted * 0.42, 1)

        # On-schedule percentage
        active_count = sum(1 for r in reqs if r.status not in [RequestStatus.PROCESSED, RequestStatus.CANCELLED])
        on_schedule_count = sum(1 for r in reqs if r.status not in [RequestStatus.PROCESSED, RequestStatus.CANCELLED] and r.waiting_days < 2)
        on_schedule_pct = int((on_schedule_count / active_count * 100)) if active_count > 0 else 88

        # Category distribution
        cat_dist: Dict[str, int] = {}
        for r in reqs:
            cat_dist[r.category.value] = cat_dist.get(r.category.value, 0) + 1

        # Status distribution
        stat_dist: Dict[str, int] = {}
        for r in reqs:
            stat_dist[r.status.value] = stat_dist.get(r.status.value, 0) + 1

        # Area distribution
        area_dist: Dict[str, int] = {}
        for r in reqs:
            area_dist[r.area] = area_dist.get(r.area, 0) + 1

        return AnalyticsOverview(
            total_requests=total,
            pending_requests=pending,
            high_priority_count=high_pri,
            today_pickups=today_pickups,
            completed_pickups=completed,
            waste_diverted_kg=waste_diverted,
            co2_avoided_kg=co2_avoided,
            on_schedule_percentage=on_schedule_pct,
            needs_attention_count=needs_attention,
            category_distribution=cat_dist,
            status_distribution=stat_dist,
            area_distribution=area_dist
        )

# Global singleton
db = Database()

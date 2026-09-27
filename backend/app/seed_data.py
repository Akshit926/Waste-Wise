from typing import List
from .models import PickupRequest, CollectionBatch, WasteCategory, PriorityLevel, RequestStatus, WasteJourneyStep

INITIAL_REQUESTS: List[dict] = [
    {
        "id": "WW1042",
        "customer_name": "Rahul Sharma",
        "phone": "+91 98231 44521",
        "email": "rahul.sharma@example.com",
        "address": "Flat 402, Rohan Tarang, Datta Mandir Road",
        "area": "Wakad",
        "landmark": "Near Ginger Hotel",
        "pin_code": "411057",
        "category": WasteCategory.HAZARDOUS,
        "items_description": "2 Inverter batteries & lead acid cells",
        "quantity": 2.0,
        "quantity_unit": "units",
        "pickup_date": "2026-09-28",
        "pickup_slot": "04:00 PM - 06:00 PM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.HIGH,
        "priority_score": 90,
        "priority_reason": "Hazardous waste risk (+40) + waiting 2 days (+20) + scheduled tomorrow (+20) + large volume (+10)",
        "batch_id": None,
        "created_at": "2026-09-25T14:30:00Z",
        "waiting_days": 2,
        "notes": "Batteries stored upright on cardboard in balcony. Heavy weight.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "25 Sept 2026, 02:30 PM",
                "status": "completed",
                "description": "Hazardous pickup logged with heavy weight advisory."
            },
            {
                "step": "Request Reviewed",
                "timestamp": "26 Sept 2026, 10:00 AM",
                "status": "completed",
                "description": "Triage verified toxic lead-acid protocol."
            },
            {
                "step": "Collector Assigned",
                "timestamp": None,
                "status": "pending",
                "description": "Pending cluster batch assignment."
            },
            {
                "step": "Pickup Scheduled",
                "timestamp": None,
                "status": "pending",
                "description": "Window booked for 28 Sept, 05:00 PM."
            },
            {
                "step": "Waste Collected",
                "timestamp": None,
                "status": "pending",
                "description": "Hazardous safety container required."
            },
            {
                "step": "Recycled / Processed",
                "timestamp": None,
                "status": "pending",
                "description": "Designated for authorized lead smelting reclamation."
            }
        ]
    },
    {
        "id": "WW1045",
        "customer_name": "Pooja Deshmukh",
        "phone": "+91 97645 11209",
        "email": "pooja.d@example.com",
        "address": "Bldg C, Mont Vert Tropez, Shankar Kalat Nagar",
        "area": "Wakad",
        "landmark": "Opposite EuroSchool",
        "pin_code": "411057",
        "category": WasteCategory.E_WASTE,
        "items_description": "Old Dell laptop, charging cables & lithium tablet",
        "quantity": 3.0,
        "quantity_unit": "items",
        "pickup_date": "2026-09-28",
        "pickup_slot": "04:00 PM - 06:00 PM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.HIGH,
        "priority_score": 75,
        "priority_reason": "E-Waste specialized stream (+30) + waiting 1 day (+10) + scheduled tomorrow (+20) + standard volume (+5)",
        "batch_id": None,
        "created_at": "2026-09-26T11:15:00Z",
        "waiting_days": 1,
        "notes": "Hard drives wiped, lithium batteries intact inside devices.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "26 Sept 2026, 11:15 AM",
                "status": "completed",
                "description": "E-waste request logged via Smart Triage."
            },
            {
                "step": "Request Reviewed",
                "timestamp": "26 Sept 2026, 04:00 PM",
                "status": "completed",
                "description": "Approved for certified electronics recovery."
            }
        ]
    },
    {
        "id": "WW1046",
        "customer_name": "Aditya Kulkarni",
        "phone": "+91 98902 33419",
        "email": "aditya.k@example.com",
        "address": "Rowhouse 7, Park Xpress, Choudhary Park",
        "area": "Wakad",
        "landmark": "Near Wakad Bridge",
        "pin_code": "411057",
        "category": WasteCategory.PLASTIC,
        "items_description": "Clean sorted PET bottles & delivery bubble wraps",
        "quantity": 12.0,
        "quantity_unit": "kg",
        "pickup_date": "2026-09-28",
        "pickup_slot": "04:00 PM - 06:00 PM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.NORMAL,
        "priority_score": 40,
        "priority_reason": "Standard recyclables (+10) + requested recently (+0) + scheduled tomorrow (+20) + large volume (+10)",
        "batch_id": None,
        "created_at": "2026-09-27T08:30:00Z",
        "waiting_days": 0,
        "notes": "Bundled in two transparent heavy-gauge garbage bags.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "27 Sept 2026, 08:30 AM",
                "status": "completed",
                "description": "Plastic sorting verified by user."
            }
        ]
    },
    {
        "id": "WW1048",
        "customer_name": "Vikram Sethi",
        "phone": "+91 98810 99823",
        "email": "vikram.sethi@techmail.com",
        "address": "Tower 4, Blue Ridge Paranjape, Phase 1",
        "area": "Hinjewadi",
        "landmark": "Behind Cognizant Campus",
        "pin_code": "411057",
        "category": WasteCategory.HAZARDOUS,
        "items_description": "Industrial solvent residue cans & epoxy hardener",
        "quantity": 4.0,
        "quantity_unit": "cans",
        "pickup_date": "2026-09-28",
        "pickup_slot": "02:00 PM - 04:00 PM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.HIGH,
        "priority_score": 75,
        "priority_reason": "Hazardous waste handling (+40) + waiting 1 day (+10) + scheduled tomorrow (+20) + standard volume (+5)",
        "batch_id": None,
        "created_at": "2026-09-26T09:00:00Z",
        "waiting_days": 1,
        "notes": "Flammable vapors precaution. Kept in shaded well-ventilated yard.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "26 Sept 2026, 09:00 AM",
                "status": "completed",
                "description": "Hazardous chemicals flagged by Triage."
            }
        ]
    },
    {
        "id": "WW1049",
        "customer_name": "Sneha Patil",
        "phone": "+91 97632 88710",
        "email": "sneha.patil@example.com",
        "address": "A-12, Megapolis Splendora, Phase 3",
        "area": "Hinjewadi",
        "landmark": "Near TCS Sahyadri Park",
        "pin_code": "411057",
        "category": WasteCategory.E_WASTE,
        "items_description": "2 PC monitors, mechanical keyboards & cables",
        "quantity": 4.0,
        "quantity_unit": "items",
        "pickup_date": "2026-09-28",
        "pickup_slot": "02:00 PM - 04:00 PM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.MEDIUM,
        "priority_score": 55,
        "priority_reason": "E-Waste specialized stream (+30) + requested recently (+0) + scheduled tomorrow (+20) + standard volume (+5)",
        "batch_id": None,
        "created_at": "2026-09-27T07:45:00Z",
        "waiting_days": 0,
        "notes": "Monitors bubble-wrapped to avoid panel shattering.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "27 Sept 2026, 07:45 AM",
                "status": "completed",
                "description": "Electronics collection requested."
            }
        ]
    },
    {
        "id": "WW1050",
        "customer_name": "Nikhil Shinde",
        "phone": "+91 98220 54128",
        "email": "nikhil.shinde@example.com",
        "address": "House 14, Palladio Society, Balewadi High Street",
        "area": "Baner",
        "landmark": "Near Cummins India Office",
        "pin_code": "411045",
        "category": WasteCategory.BULK,
        "items_description": "Old 3-seater fabric sofa and broken study desk",
        "quantity": 2.0,
        "quantity_unit": "units",
        "pickup_date": "2026-09-29",
        "pickup_slot": "10:00 AM - 01:00 PM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.MEDIUM,
        "priority_score": 45,
        "priority_reason": "Heavy bulk logistics (+20) + waiting 1 day (+10) + scheduled later (+10) + large volume (+10)",
        "batch_id": None,
        "created_at": "2026-09-26T16:00:00Z",
        "waiting_days": 1,
        "notes": "Service elevator available. Requires two personnel.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "26 Sept 2026, 04:00 PM",
                "status": "completed",
                "description": "Bulky furniture pickup scheduled."
            }
        ]
    },
    {
        "id": "WW1051",
        "customer_name": "Ananya Joshi",
        "phone": "+91 99221 66532",
        "email": "ananya.j@example.com",
        "address": "B-304, Regent Plaza, Baner Road",
        "area": "Baner",
        "landmark": "Near D-Mart Baner",
        "pin_code": "411045",
        "category": WasteCategory.PAPER,
        "items_description": "Office archive corrugated boxes & shredded documents",
        "quantity": 18.0,
        "quantity_unit": "kg",
        "pickup_date": "2026-09-29",
        "pickup_slot": "10:00 AM - 01:00 PM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.NORMAL,
        "priority_score": 30,
        "priority_reason": "Standard recyclables (+10) + requested recently (+0) + scheduled later (+10) + large volume (+10)",
        "batch_id": None,
        "created_at": "2026-09-27T09:10:00Z",
        "waiting_days": 0,
        "notes": "Clean dry cardboard, packed in recyclable jute bags.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "27 Sept 2026, 09:10 AM",
                "status": "completed",
                "description": "Paper recovery logged."
            }
        ]
    },
    {
        "id": "WW1052",
        "customer_name": "Dr. Sameer Gaikwad",
        "phone": "+91 94220 18872",
        "email": "clinic.gaikwad@example.com",
        "address": "Plot 88, ITI Road, Sanewadi",
        "area": "Aundh",
        "landmark": "Near Breman Chowk",
        "pin_code": "411007",
        "category": WasteCategory.HAZARDOUS,
        "items_description": "Expired OTC pharmaceutical syrups & blister packs",
        "quantity": 3.5,
        "quantity_unit": "kg",
        "pickup_date": "2026-09-28",
        "pickup_slot": "11:00 AM - 01:00 PM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.HIGH,
        "priority_score": 85,
        "priority_reason": "Hazardous waste handling (+40) + waiting 2 days (+20) + scheduled tomorrow (+20) + standard volume (+5)",
        "batch_id": None,
        "created_at": "2026-09-25T17:00:00Z",
        "waiting_days": 2,
        "notes": "Strict non-biomedical household expired medications. High environmental hazard if poured into sewer.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "25 Sept 2026, 05:00 PM",
                "status": "completed",
                "description": "Pharmaceutical disposal request received."
            },
            {
                "step": "Request Reviewed",
                "timestamp": "26 Sept 2026, 09:30 AM",
                "status": "completed",
                "description": "High temperature incineration stream earmarked."
            }
        ]
    },
    {
        "id": "WW1053",
        "customer_name": "Meera Rao",
        "phone": "+91 98500 77123",
        "email": "meera.rao@example.com",
        "address": "C-101, Roseland Residency, Kunal Icon Road",
        "area": "Pimple Saudagar",
        "landmark": "Near Govind Garden",
        "pin_code": "411027",
        "category": WasteCategory.ORGANIC,
        "items_description": "Bulk community composting wet waste & dry garden prunings",
        "quantity": 25.0,
        "quantity_unit": "kg",
        "pickup_date": "2026-09-28",
        "pickup_slot": "09:00 AM - 11:00 AM",
        "status": RequestStatus.REQUESTED,
        "priority": PriorityLevel.MEDIUM,
        "priority_score": 45,
        "priority_reason": "Perishable organic stream (+15) + requested recently (+0) + scheduled tomorrow (+20) + large volume (+10)",
        "batch_id": None,
        "created_at": "2026-09-27T06:00:00Z",
        "waiting_days": 0,
        "notes": "Composting culture pre-applied. In ventilated bin drums.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "27 Sept 2026, 06:00 AM",
                "status": "completed",
                "description": "Organic bio-methanation route selected."
            }
        ]
    },
    {
        "id": "WW1038",
        "customer_name": "Tanmay Verma",
        "phone": "+91 97666 43211",
        "email": "tanmay.v@example.com",
        "address": "Flat 801, Windchimes, Kaspate Vasti",
        "area": "Wakad",
        "landmark": "Near Chatrapati Chowk",
        "pin_code": "411057",
        "category": WasteCategory.GLASS,
        "items_description": "Broken window pane & glass jars (wrapped safely)",
        "quantity": 5.0,
        "quantity_unit": "kg",
        "pickup_date": "2026-09-27",
        "pickup_slot": "05:00 PM - 07:00 PM",
        "status": RequestStatus.SCHEDULED,
        "priority": PriorityLevel.MEDIUM,
        "priority_score": 55,
        "priority_reason": "Standard recyclables (+10) + waiting 1 day (+10) + pickup scheduled today (+30) + standard volume (+5)",
        "batch_id": "B-001",
        "created_at": "2026-09-26T12:00:00Z",
        "waiting_days": 1,
        "notes": "Marked clearly as Fragile Sharp Glass.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "26 Sept 2026, 12:00 PM",
                "status": "completed",
                "description": "Request submitted with sharp hazard note."
            },
            {
                "step": "Request Reviewed",
                "timestamp": "26 Sept 2026, 03:30 PM",
                "status": "completed",
                "description": "Approved and slotted for cullet recovery."
            },
            {
                "step": "Collector Assigned",
                "timestamp": "27 Sept 2026, 08:30 AM",
                "status": "completed",
                "description": "Collector Pawan Jadhav (Vehicle MH-12-WW-4028) assigned."
            },
            {
                "step": "Pickup Scheduled",
                "timestamp": "27 Sept 2026, 10:00 AM",
                "status": "completed",
                "description": "Scheduled for today evening route."
            },
            {
                "step": "Waste Collected",
                "timestamp": None,
                "status": "pending",
                "description": "Vehicle en route."
            }
        ]
    },
    {
        "id": "WW1035",
        "customer_name": "Kavita Nair",
        "phone": "+91 98230 45678",
        "email": "kavita.nair@example.com",
        "address": "Villa 19, Pride Aashiyana",
        "area": "Baner",
        "landmark": "Near Balewadi Stadium",
        "pin_code": "411045",
        "category": WasteCategory.METAL,
        "items_description": "Discarded brass plumbing valves & copper wire rolls",
        "quantity": 8.0,
        "quantity_unit": "kg",
        "pickup_date": "2026-09-27",
        "pickup_slot": "03:00 PM - 05:00 PM",
        "status": RequestStatus.OUT_FOR_PICKUP,
        "priority": PriorityLevel.MEDIUM,
        "priority_score": 45,
        "priority_reason": "Standard recyclables (+10) + requested recently (+0) + pickup scheduled today (+30) + standard volume (+5)",
        "batch_id": "B-002",
        "created_at": "2026-09-27T08:00:00Z",
        "waiting_days": 0,
        "notes": "Non-ferrous metal scrap sorted.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "27 Sept 2026, 08:00 AM",
                "status": "completed",
                "description": "Metal recovery request accepted."
            },
            {
                "step": "Request Reviewed",
                "timestamp": "27 Sept 2026, 09:15 AM",
                "status": "completed",
                "description": "Scrap grade authenticated."
            },
            {
                "step": "Collector Assigned",
                "timestamp": "27 Sept 2026, 10:45 AM",
                "status": "completed",
                "description": "Assigned to Team Beta."
            },
            {
                "step": "Out for Pickup",
                "timestamp": "27 Sept 2026, 02:30 PM",
                "status": "in_progress",
                "description": "Vehicle MH-12-WW-1102 within 2 km of pickup location."
            }
        ]
    },
    # Completed requests with FULL downstream Waste Journey
    {
        "id": "WW1020",
        "customer_name": "Akshit Sharma (Demo User)",
        "phone": "+91 98221 00987",
        "email": "akshit@wastewise.io",
        "address": "Flat 304, Green Olive Society, Hinjewadi Phase 1",
        "area": "Hinjewadi",
        "landmark": "Near Shivaji Chowk",
        "pin_code": "411057",
        "category": WasteCategory.E_WASTE,
        "items_description": "Old HP Pavilion Laptop & Lithium Ion battery pack",
        "quantity": 2.0,
        "quantity_unit": "items",
        "pickup_date": "2026-09-24",
        "pickup_slot": "03:00 PM - 05:00 PM",
        "status": RequestStatus.PROCESSED,
        "priority": PriorityLevel.HIGH,
        "priority_score": 85,
        "priority_reason": "E-Waste specialized stream (+30) + high toxicity prevention",
        "batch_id": "B-000-HIST",
        "created_at": "2026-09-23T10:00:00Z",
        "waiting_days": 0,
        "notes": "Demo user primary record.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "23 Sept 2026, 10:00 AM",
                "status": "completed",
                "description": "Logged via WasteWise Smart Triage."
            },
            {
                "step": "Request Reviewed",
                "timestamp": "23 Sept 2026, 11:30 AM",
                "status": "completed",
                "description": "E-Waste protocol certified by municipal coordinator."
            },
            {
                "step": "Collector Assigned",
                "timestamp": "24 Sept 2026, 09:00 AM",
                "status": "completed",
                "description": "Assigned to Specialized E-Waste Team 4."
            },
            {
                "step": "Pickup Scheduled",
                "timestamp": "24 Sept 2026, 10:15 AM",
                "status": "completed",
                "description": "Driver Sunil Mane dispatched with electrostatic safety crate."
            },
            {
                "step": "Waste Collected",
                "timestamp": "24 Sept 2026, 03:45 PM",
                "status": "completed",
                "description": "Verified at doorstep. Barcode WW-9021 applied."
            },
            {
                "step": "Recycled / Processed",
                "timestamp": "25 Sept 2026, 16:30 PM",
                "status": "completed",
                "description": "Dismantled at Chakan E-Waste Eco-Facility. 94.2% materials recovered (Copper, Gold pins, Lithium).",
                "facility": "Chakan Green Tech Park - Unit 4",
                "certificate_id": "CER-WW-2026-E882"
            }
        ]
    },
    {
        "id": "WW1018",
        "customer_name": "Priya Kulkarni",
        "phone": "+91 97654 32190",
        "email": "priya.k@example.com",
        "address": "Apt 501, Ivory Tower, Aundh",
        "area": "Aundh",
        "landmark": "Near Westend Mall",
        "pin_code": "411007",
        "category": WasteCategory.PLASTIC,
        "items_description": "Clean sorted plastic containers & HDPE drums",
        "quantity": 14.5,
        "quantity_unit": "kg",
        "pickup_date": "2026-09-23",
        "pickup_slot": "10:00 AM - 12:00 PM",
        "status": RequestStatus.PROCESSED,
        "priority": PriorityLevel.NORMAL,
        "priority_score": 25,
        "priority_reason": "Standard recyclables (+10) + completed smoothly",
        "batch_id": "B-000-HIST",
        "created_at": "2026-09-22T14:00:00Z",
        "waiting_days": 0,
        "notes": "Processed into recycled plastic pellets.",
        "journey": [
            {
                "step": "Request Submitted",
                "timestamp": "22 Sept 2026, 02:00 PM",
                "status": "completed",
                "description": "User confirmed rinsed plastics."
            },
            {
                "step": "Waste Collected",
                "timestamp": "23 Sept 2026, 11:20 AM",
                "status": "completed",
                "description": "Collected by Route 7."
            },
            {
                "step": "Recycled / Processed",
                "timestamp": "24 Sept 2026, 04:00 PM",
                "status": "completed",
                "description": "Pelletized at Thergaon Polymer Recycling Center.",
                "facility": "Thergaon Circular Plant",
                "certificate_id": "CER-WW-2026-P419"
            }
        ]
    }
]

INITIAL_BATCHES: List[dict] = [
    {
        "id": "B-001",
        "area": "Wakad",
        "pickup_date": "2026-09-27",
        "request_ids": ["WW1038"],
        "requests_count": 1,
        "priority": PriorityLevel.MEDIUM,
        "status": "In Transit",
        "assigned_vehicle": "MH-12-WW-4028",
        "assigned_collector": "Pawan Jadhav (Route Lead)",
        "created_at": "2026-09-27T08:30:00Z"
    },
    {
        "id": "B-002",
        "area": "Baner",
        "pickup_date": "2026-09-27",
        "request_ids": ["WW1035"],
        "requests_count": 1,
        "priority": PriorityLevel.MEDIUM,
        "status": "In Transit",
        "assigned_vehicle": "MH-12-WW-1102",
        "assigned_collector": "Santosh More",
        "created_at": "2026-09-27T10:00:00Z"
    }
]

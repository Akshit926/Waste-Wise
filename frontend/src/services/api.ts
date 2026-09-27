import {
  PickupRequest,
  CollectionBatch,
  BatchRecommendation,
  AnalyticsOverview,
  TriageResponse,
  CreatePickupPayload,
  RequestStatus,
  WasteCategory
} from '../types';

const API_BASE = '/api';

// Initial local seed state in case running standalone
const LOCAL_STORAGE_KEY = 'wastewise_data_v1';

export const INITIAL_SEEDS: PickupRequest[] = [
  {
    id: "WW1042",
    customer_name: "Rahul Sharma",
    phone: "+91 98231 44521",
    email: "rahul.sharma@example.com",
    address: "Flat 402, Rohan Tarang, Datta Mandir Road",
    area: "Wakad",
    landmark: "Near Ginger Hotel",
    pin_code: "411057",
    category: "Hazardous",
    items_description: "2 Inverter batteries & lead acid cells",
    quantity: 2,
    quantity_unit: "units",
    pickup_date: "2026-09-28",
    pickup_slot: "04:00 PM - 06:00 PM",
    status: "Requested",
    priority: "HIGH",
    priority_score: 90,
    priority_reason: "Hazardous waste risk (+40) + waiting 2 days (+20) + scheduled tomorrow (+20) + large volume (+10)",
    batch_id: null,
    created_at: "2026-09-25T14:30:00Z",
    waiting_days: 2,
    notes: "Batteries stored upright on cardboard in balcony. Heavy weight.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "25 Sept 2026, 02:30 PM",
        status: "completed",
        description: "Hazardous pickup logged with heavy weight advisory."
      },
      {
        step: "Request Reviewed",
        timestamp: "26 Sept 2026, 10:00 AM",
        status: "completed",
        description: "Triage verified toxic lead-acid protocol."
      },
      {
        step: "Collector Assigned",
        status: "pending",
        description: "Pending cluster batch assignment."
      },
      {
        step: "Pickup Scheduled",
        status: "pending",
        description: "Window booked for 28 Sept, 05:00 PM."
      },
      {
        step: "Waste Collected",
        status: "pending",
        description: "Hazardous safety container required."
      },
      {
        step: "Recycled / Processed",
        status: "pending",
        description: "Designated for authorized lead smelting reclamation."
      }
    ]
  },
  {
    id: "WW1045",
    customer_name: "Pooja Deshmukh",
    phone: "+91 97645 11209",
    email: "pooja.d@example.com",
    address: "Bldg C, Mont Vert Tropez, Shankar Kalat Nagar",
    area: "Wakad",
    landmark: "Opposite EuroSchool",
    pin_code: "411057",
    category: "E-Waste",
    items_description: "Old Dell laptop, charging cables & lithium tablet",
    quantity: 3,
    quantity_unit: "items",
    pickup_date: "2026-09-28",
    pickup_slot: "04:00 PM - 06:00 PM",
    status: "Requested",
    priority: "HIGH",
    priority_score: 75,
    priority_reason: "E-Waste specialized stream (+30) + waiting 1 day (+10) + scheduled tomorrow (+20) + standard volume (+5)",
    batch_id: null,
    created_at: "2026-09-26T11:15:00Z",
    waiting_days: 1,
    notes: "Hard drives wiped, lithium batteries intact inside devices.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "26 Sept 2026, 11:15 AM",
        status: "completed",
        description: "E-waste request logged via Smart Triage."
      },
      {
        step: "Request Reviewed",
        timestamp: "26 Sept 2026, 04:00 PM",
        status: "completed",
        description: "Approved for certified electronics recovery."
      }
    ]
  },
  {
    id: "WW1046",
    customer_name: "Aditya Kulkarni",
    phone: "+91 98902 33419",
    email: "aditya.k@example.com",
    address: "Rowhouse 7, Park Xpress, Choudhary Park",
    area: "Wakad",
    landmark: "Near Wakad Bridge",
    pin_code: "411057",
    category: "Plastic",
    items_description: "Clean sorted PET bottles & delivery bubble wraps",
    quantity: 12,
    quantity_unit: "kg",
    pickup_date: "2026-09-28",
    pickup_slot: "04:00 PM - 06:00 PM",
    status: "Requested",
    priority: "NORMAL",
    priority_score: 40,
    priority_reason: "Standard recyclables (+10) + requested recently (+0) + scheduled tomorrow (+20) + large volume (+10)",
    batch_id: null,
    created_at: "2026-09-27T08:30:00Z",
    waiting_days: 0,
    notes: "Bundled in two transparent heavy-gauge garbage bags.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "27 Sept 2026, 08:30 AM",
        status: "completed",
        description: "Plastic sorting verified by user."
      }
    ]
  },
  {
    id: "WW1048",
    customer_name: "Vikram Sethi",
    phone: "+91 98810 99823",
    email: "vikram.sethi@techmail.com",
    address: "Tower 4, Blue Ridge Paranjape, Phase 1",
    area: "Hinjewadi",
    landmark: "Behind Cognizant Campus",
    pin_code: "411057",
    category: "Hazardous",
    items_description: "Industrial solvent residue cans & epoxy hardener",
    quantity: 4,
    quantity_unit: "cans",
    pickup_date: "2026-09-28",
    pickup_slot: "02:00 PM - 04:00 PM",
    status: "Requested",
    priority: "HIGH",
    priority_score: 75,
    priority_reason: "Hazardous waste handling (+40) + waiting 1 day (+10) + scheduled tomorrow (+20) + standard volume (+5)",
    batch_id: null,
    created_at: "2026-09-26T09:00:00Z",
    waiting_days: 1,
    notes: "Flammable vapors precaution. Kept in shaded yard.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "26 Sept 2026, 09:00 AM",
        status: "completed",
        description: "Hazardous chemicals flagged by Triage."
      }
    ]
  },
  {
    id: "WW1049",
    customer_name: "Sneha Patil",
    phone: "+91 97632 88710",
    email: "sneha.patil@example.com",
    address: "A-12, Megapolis Splendora, Phase 3",
    area: "Hinjewadi",
    landmark: "Near TCS Sahyadri Park",
    pin_code: "411057",
    category: "E-Waste",
    items_description: "2 PC monitors, mechanical keyboards & cables",
    quantity: 4,
    quantity_unit: "items",
    pickup_date: "2026-09-28",
    pickup_slot: "02:00 PM - 04:00 PM",
    status: "Requested",
    priority: "MEDIUM",
    priority_score: 55,
    priority_reason: "E-Waste specialized stream (+30) + requested recently (+0) + scheduled tomorrow (+20) + standard volume (+5)",
    batch_id: null,
    created_at: "2026-09-27T07:45:00Z",
    waiting_days: 0,
    notes: "Monitors bubble-wrapped to avoid panel shattering.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "27 Sept 2026, 07:45 AM",
        status: "completed",
        description: "Electronics collection requested."
      }
    ]
  },
  {
    id: "WW1050",
    customer_name: "Nikhil Shinde",
    phone: "+91 98220 54128",
    email: "nikhil.shinde@example.com",
    address: "House 14, Palladio Society, Balewadi High Street",
    area: "Baner",
    landmark: "Near Cummins India Office",
    pin_code: "411045",
    category: "Bulk Waste",
    items_description: "Old 3-seater fabric sofa and broken study desk",
    quantity: 2,
    quantity_unit: "units",
    pickup_date: "2026-09-29",
    pickup_slot: "10:00 AM - 01:00 PM",
    status: "Requested",
    priority: "MEDIUM",
    priority_score: 45,
    priority_reason: "Heavy bulk logistics (+20) + waiting 1 day (+10) + scheduled later (+10) + large volume (+10)",
    batch_id: null,
    created_at: "2026-09-26T16:00:00Z",
    waiting_days: 1,
    notes: "Service elevator available. Requires two personnel.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "26 Sept 2026, 04:00 PM",
        status: "completed",
        description: "Bulky furniture pickup scheduled."
      }
    ]
  },
  {
    id: "WW1051",
    customer_name: "Ananya Joshi",
    phone: "+91 99221 66532",
    email: "ananya.j@example.com",
    address: "B-304, Regent Plaza, Baner Road",
    area: "Baner",
    landmark: "Near D-Mart Baner",
    pin_code: "411045",
    category: "Paper",
    items_description: "Office archive corrugated boxes & shredded documents",
    quantity: 18,
    quantity_unit: "kg",
    pickup_date: "2026-09-29",
    pickup_slot: "10:00 AM - 01:00 PM",
    status: "Requested",
    priority: "NORMAL",
    priority_score: 30,
    priority_reason: "Standard recyclables (+10) + requested recently (+0) + scheduled later (+10) + large volume (+10)",
    batch_id: null,
    created_at: "2026-09-27T09:10:00Z",
    waiting_days: 0,
    notes: "Clean dry cardboard, packed in recyclable jute bags.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "27 Sept 2026, 09:10 AM",
        status: "completed",
        description: "Paper recovery logged."
      }
    ]
  },
  {
    id: "WW1052",
    customer_name: "Dr. Sameer Gaikwad",
    phone: "+91 94220 18872",
    email: "clinic.gaikwad@example.com",
    address: "Plot 88, ITI Road, Sanewadi",
    area: "Aundh",
    landmark: "Near Breman Chowk",
    pin_code: "411007",
    category: "Hazardous",
    items_description: "Expired OTC pharmaceutical syrups & blister packs",
    quantity: 3.5,
    quantity_unit: "kg",
    pickup_date: "2026-09-28",
    pickup_slot: "11:00 AM - 01:00 PM",
    status: "Requested",
    priority: "HIGH",
    priority_score: 85,
    priority_reason: "Hazardous waste handling (+40) + waiting 2 days (+20) + scheduled tomorrow (+20) + standard volume (+5)",
    batch_id: null,
    created_at: "2026-09-25T17:00:00Z",
    waiting_days: 2,
    notes: "Strict non-biomedical household expired medications.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "25 Sept 2026, 05:00 PM",
        status: "completed",
        description: "Pharmaceutical disposal request received."
      },
      {
        step: "Request Reviewed",
        timestamp: "26 Sept 2026, 09:30 AM",
        status: "completed",
        description: "High temperature incineration stream earmarked."
      }
    ]
  },
  {
    id: "WW1053",
    customer_name: "Meera Rao",
    phone: "+91 98500 77123",
    email: "meera.rao@example.com",
    address: "C-101, Roseland Residency, Kunal Icon Road",
    area: "Pimple Saudagar",
    landmark: "Near Govind Garden",
    pin_code: "411027",
    category: "Organic",
    items_description: "Bulk community composting wet waste & dry garden prunings",
    quantity: 25,
    quantity_unit: "kg",
    pickup_date: "2026-09-28",
    pickup_slot: "09:00 AM - 11:00 AM",
    status: "Requested",
    priority: "MEDIUM",
    priority_score: 45,
    priority_reason: "Perishable organic stream (+15) + requested recently (+0) + scheduled tomorrow (+20) + large volume (+10)",
    batch_id: null,
    created_at: "2026-09-27T06:00:00Z",
    waiting_days: 0,
    notes: "Composting culture pre-applied. In ventilated bin drums.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "27 Sept 2026, 06:00 AM",
        status: "completed",
        description: "Organic bio-methanation route selected."
      }
    ]
  },
  {
    id: "WW1038",
    customer_name: "Tanmay Verma",
    phone: "+91 97666 43211",
    email: "tanmay.v@example.com",
    address: "Flat 801, Windchimes, Kaspate Vasti",
    area: "Wakad",
    landmark: "Near Chatrapati Chowk",
    pin_code: "411057",
    category: "Glass",
    items_description: "Broken window pane & glass jars (wrapped safely)",
    quantity: 5,
    quantity_unit: "kg",
    pickup_date: "2026-09-27",
    pickup_slot: "05:00 PM - 07:00 PM",
    status: "Scheduled",
    priority: "MEDIUM",
    priority_score: 55,
    priority_reason: "Standard recyclables (+10) + waiting 1 day (+10) + pickup scheduled today (+30) + standard volume (+5)",
    batch_id: "B-001",
    created_at: "2026-09-26T12:00:00Z",
    waiting_days: 1,
    notes: "Marked clearly as Fragile Sharp Glass.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "26 Sept 2026, 12:00 PM",
        status: "completed",
        description: "Request submitted with sharp hazard note."
      },
      {
        step: "Request Reviewed",
        timestamp: "26 Sept 2026, 03:30 PM",
        status: "completed",
        description: "Approved and slotted for cullet recovery."
      },
      {
        step: "Collector Assigned",
        timestamp: "27 Sept 2026, 08:30 AM",
        status: "completed",
        description: "Collector Pawan Jadhav (Vehicle MH-12-WW-4028) assigned."
      },
      {
        step: "Pickup Scheduled",
        timestamp: "27 Sept 2026, 10:00 AM",
        status: "completed",
        description: "Scheduled for today evening route."
      },
      {
        step: "Waste Collected",
        status: "pending",
        description: "Vehicle en route."
      }
    ]
  },
  {
    id: "WW1035",
    customer_name: "Kavita Nair",
    phone: "+91 98230 45678",
    email: "kavita.nair@example.com",
    address: "Villa 19, Pride Aashiyana",
    area: "Baner",
    landmark: "Near Balewadi Stadium",
    pin_code: "411045",
    category: "Metal",
    items_description: "Discarded brass plumbing valves & copper wire rolls",
    quantity: 8,
    quantity_unit: "kg",
    pickup_date: "2026-09-27",
    pickup_slot: "03:00 PM - 05:00 PM",
    status: "Out for Pickup",
    priority: "MEDIUM",
    priority_score: 45,
    priority_reason: "Standard recyclables (+10) + requested recently (+0) + pickup scheduled today (+30) + standard volume (+5)",
    batch_id: "B-002",
    created_at: "2026-09-27T08:00:00Z",
    waiting_days: 0,
    notes: "Non-ferrous metal scrap sorted.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "27 Sept 2026, 08:00 AM",
        status: "completed",
        description: "Metal recovery request accepted."
      },
      {
        step: "Request Reviewed",
        timestamp: "27 Sept 2026, 09:15 AM",
        status: "completed",
        description: "Scrap grade authenticated."
      },
      {
        step: "Collector Assigned",
        timestamp: "27 Sept 2026, 10:45 AM",
        status: "completed",
        description: "Assigned to Team Beta."
      },
      {
        step: "Out for Pickup",
        timestamp: "27 Sept 2026, 02:30 PM",
        status: "in_progress",
        description: "Vehicle MH-12-WW-1102 within 2 km of pickup location."
      }
    ]
  },
  {
    id: "WW1020",
    customer_name: "Akshit Sharma (Demo User)",
    phone: "+91 98221 00987",
    email: "akshit@wastewise.io",
    address: "Flat 304, Green Olive Society, Hinjewadi Phase 1",
    area: "Hinjewadi",
    landmark: "Near Shivaji Chowk",
    pin_code: "411057",
    category: "E-Waste",
    items_description: "Old HP Pavilion Laptop & Lithium Ion battery pack",
    quantity: 2,
    quantity_unit: "items",
    pickup_date: "2026-09-24",
    pickup_slot: "03:00 PM - 05:00 PM",
    status: "Processed",
    priority: "HIGH",
    priority_score: 85,
    priority_reason: "E-Waste specialized stream (+30) + high toxicity prevention",
    batch_id: "B-000-HIST",
    created_at: "2026-09-23T10:00:00Z",
    waiting_days: 0,
    notes: "Demo user primary record.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "23 Sept 2026, 10:00 AM",
        status: "completed",
        description: "Logged via WasteWise Smart Triage."
      },
      {
        step: "Request Reviewed",
        timestamp: "23 Sept 2026, 11:30 AM",
        status: "completed",
        description: "E-Waste protocol certified by municipal coordinator."
      },
      {
        step: "Collector Assigned",
        timestamp: "24 Sept 2026, 09:00 AM",
        status: "completed",
        description: "Assigned to Specialized E-Waste Team 4."
      },
      {
        step: "Pickup Scheduled",
        timestamp: "24 Sept 2026, 10:15 AM",
        status: "completed",
        description: "Driver Sunil Mane dispatched with electrostatic safety crate."
      },
      {
        step: "Waste Collected",
        timestamp: "24 Sept 2026, 03:45 PM",
        status: "completed",
        description: "Verified at doorstep. Barcode WW-9021 applied."
      },
      {
        step: "Recycled / Processed",
        timestamp: "25 Sept 2026, 04:30 PM",
        status: "completed",
        description: "Dismantled at Chakan E-Waste Eco-Facility. 94.2% materials recovered (Copper, Gold pins, Lithium).",
        facility: "Chakan Green Tech Park - Unit 4",
        certificate_id: "CER-WW-2026-E882"
      }
    ]
  },
  {
    id: "WW1018",
    customer_name: "Priya Kulkarni",
    phone: "+91 97654 32190",
    email: "priya.k@example.com",
    address: "Apt 501, Ivory Tower, Aundh",
    area: "Aundh",
    landmark: "Near Westend Mall",
    pin_code: "411007",
    category: "Plastic",
    items_description: "Clean sorted plastic containers & HDPE drums",
    quantity: 14.5,
    quantity_unit: "kg",
    pickup_date: "2026-09-23",
    pickup_slot: "10:00 AM - 12:00 PM",
    status: "Processed",
    priority: "NORMAL",
    priority_score: 25,
    priority_reason: "Standard recyclables (+10) + completed smoothly",
    batch_id: "B-000-HIST",
    created_at: "2026-09-22T14:00:00Z",
    waiting_days: 0,
    notes: "Processed into recycled plastic pellets.",
    journey: [
      {
        step: "Request Submitted",
        timestamp: "22 Sept 2026, 02:00 PM",
        status: "completed",
        description: "User confirmed rinsed plastics."
      },
      {
        step: "Waste Collected",
        timestamp: "23 Sept 2026, 11:20 AM",
        status: "completed",
        description: "Collected by Route 7."
      },
      {
        step: "Recycled / Processed",
        timestamp: "24 Sept 2026, 04:00 PM",
        status: "completed",
        description: "Pelletized at Thergaon Polymer Recycling Center.",
        facility: "Thergaon Circular Plant",
        certificate_id: "CER-WW-2026-P419"
      }
    ]
  }
];

export const INITIAL_BATCHES: CollectionBatch[] = [
  {
    id: "B-001",
    area: "Wakad",
    pickup_date: "2026-09-27",
    request_ids: ["WW1038"],
    requests_count: 1,
    priority: "MEDIUM",
    status: "In Transit",
    assigned_vehicle: "MH-12-WW-4028",
    assigned_collector: "Pawan Jadhav (Route Lead)",
    created_at: "2026-09-27T08:30:00Z"
  },
  {
    id: "B-002",
    area: "Baner",
    pickup_date: "2026-09-27",
    request_ids: ["WW1035"],
    requests_count: 1,
    priority: "MEDIUM",
    status: "In Transit",
    assigned_vehicle: "MH-12-WW-1102",
    assigned_collector: "Santosh More",
    created_at: "2026-09-27T10:00:00Z"
  }
];

// Helper to get local data
function getLocalRequests(): PickupRequest[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY + '_reqs');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  return [...INITIAL_SEEDS];
}

function saveLocalRequests(reqs: PickupRequest[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_reqs', JSON.stringify(reqs));
  } catch (e) {
    console.warn(e);
  }
}

function getLocalBatches(): CollectionBatch[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY + '_batches');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  return [...INITIAL_BATCHES];
}

function saveLocalBatches(batches: CollectionBatch[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_batches', JSON.stringify(batches));
  } catch (e) {
    console.warn(e);
  }
}

// Client-side rule-based classifier matching backend
export function clientTriage(text: string): TriageResponse {
  const lower = text.toLowerCase();
  const identified: any[] = [];
  let isSpecial = false;
  let highestRisk = 10;
  let primaryCategory: WasteCategory = 'Plastic';

  // E-Waste
  if (/(laptop|computer|macbook|pc|phone|smartphone|mobile|charger|cable|keyboard|mouse|monitor|tv|screen|tablet|ipad|printer|cartridge|hard drive|gadget|earbuds|headphones)/i.test(lower)) {
    identified.push({
      item_name: "Electronic Device / E-Waste",
      category: "E-Waste" as WasteCategory,
      special_handling: true,
      handling_guidance: "Contains heavy metals, printed circuit boards and recyclable silicon. Do not dispose with general household garbage. Pack securely to prevent screen breakage or leakage.",
      risk_score: 30
    });
    isSpecial = true;
    highestRisk = Math.max(highestRisk, 30);
    primaryCategory = "E-Waste";
  }

  // Hazardous
  if (/(battery|batteries|cell|lithium|lead acid|paint|chemical|solvent|thinner|bleach|detergent|acid|pesticide|medicine|medicines|pills|syrup|fluorescent|tube light|cfl|aerosol|spray can|motor oil)/i.test(lower)) {
    identified.push({
      item_name: "Hazardous / Chemical Waste",
      category: "Hazardous" as WasteCategory,
      special_handling: true,
      handling_guidance: "Hazardous & toxic materials pose severe environmental and chemical burn hazards. Keep away from heat and moisture. Store upright in a leak-proof container; do NOT mix chemicals.",
      risk_score: 40
    });
    isSpecial = true;
    highestRisk = Math.max(highestRisk, 40);
    primaryCategory = "Hazardous";
  }

  // Plastic
  if (/(plastic|bottle|container|polybag|polythene|packaging|jug|tub|styrofoam|bubble wrap)/i.test(lower)) {
    identified.push({
      item_name: "Recyclable Plastics",
      category: "Plastic" as WasteCategory,
      special_handling: false,
      handling_guidance: "Rinse and dry all plastic containers to remove food residues. Flatten bottles to save volume.",
      risk_score: 10
    });
    if (highestRisk < 15) primaryCategory = "Plastic";
  }

  // Organic
  if (/(food|vegetable|fruit|kitchen|peel|leaves|garden|compost|leftover|bread|egg)/i.test(lower)) {
    identified.push({
      item_name: "Organic / Wet Waste",
      category: "Organic" as WasteCategory,
      special_handling: false,
      handling_guidance: "Biodegradable wet waste. Drain excess liquid before packing. Direct to composting / bio-bin.",
      risk_score: 15
    });
    if (highestRisk < 20) {
      highestRisk = Math.max(highestRisk, 15);
      primaryCategory = "Organic";
    }
  }

  // Paper
  if (/(paper|newspaper|cardboard|box|carton|magazine|book|office paper|shredded)/i.test(lower)) {
    identified.push({
      item_name: "Paper & Corrugated Cardboard",
      category: "Paper" as WasteCategory,
      special_handling: false,
      handling_guidance: "Keep paper dry and unsoiled. Flatten all corrugated cardboard boxes.",
      risk_score: 10
    });
    if (highestRisk < 12) primaryCategory = "Paper";
  }

  // Bulk
  if (/(chair|sofa|furniture|mattress|bed|desk|table|wardrobe|cabinet|appliance)/i.test(lower)) {
    identified.push({
      item_name: "Bulky Household Goods",
      category: "Bulk Waste" as WasteCategory,
      special_handling: true,
      handling_guidance: "Oversized bulky waste requiring heavy collection logistics and multi-person handling.",
      risk_score: 20
    });
    isSpecial = true;
    highestRisk = Math.max(highestRisk, 20);
    primaryCategory = "Bulk Waste";
  }

  // Metal
  if (/(metal|can|aluminium|steel|copper|wire|tin|scrap)/i.test(lower)) {
    identified.push({
      item_name: "Scrap Metal & Cans",
      category: "Metal" as WasteCategory,
      special_handling: false,
      handling_guidance: "100% recyclable high-value scrap. Clean away any sticky grease.",
      risk_score: 10
    });
  }

  // Glass
  if (/(glass|broken glass|jar|wine bottle|beer bottle|mirror)/i.test(lower)) {
    identified.push({
      item_name: "Glassware / Cullet",
      category: "Glass" as WasteCategory,
      special_handling: true,
      handling_guidance: "Fragile sharp hazard. Wrap broken glass securely and label clearly as 'SHARP GLASS'.",
      risk_score: 10
    });
    isSpecial = true;
  }

  if (identified.length === 0) {
    identified.push({
      item_name: text.trim().slice(0, 30) || "General Household Waste",
      category: "Plastic" as WasteCategory,
      special_handling: false,
      handling_guidance: "Separate into dry recyclable and wet organic bins. If containing electronic or battery components, request special e-waste handling.",
      risk_score: 10
    });
  }

  const pri = highestRisk >= 40 ? 'HIGH' : highestRisk >= 20 ? 'MEDIUM' : 'NORMAL';
  const recAction = isSpecial
    ? (primaryCategory === 'Hazardous' ? 'Schedule Certified Hazardous Waste Pickup' : 'Schedule Specialized E-Waste Collection')
    : `Schedule Standard ${primaryCategory} Pickup`;

  return {
    query: text,
    identified_items: identified,
    primary_category: primaryCategory,
    is_special_handling: isSpecial,
    summary_guidance: isSpecial
      ? `Special handling recommended for ${identified.filter(i => i.special_handling).map(i => i.item_name).join(', ')}. Do not dispose with general household waste.`
      : "Standard recyclable stream. Clean and segregate before pickup window.",
    recommended_action: recAction,
    suggested_priority: pri,
    risk_score: highestRisk
  };
}

export const api = {
  async triage(description: string): Promise<TriageResponse> {
    try {
      const res = await fetch(`${API_BASE}/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API unavailable, using resilient client triage", e);
    }
    return clientTriage(description);
  },

  async getRequests(params?: {
    search?: string;
    priority?: string;
    status?: string;
    category?: string;
    area?: string;
  }): Promise<PickupRequest[]> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.priority && params.priority !== 'All') q.set('priority', params.priority);
      if (params?.status && params.status !== 'All') q.set('status', params.status);
      if (params?.category && params.category !== 'All') q.set('category', params.category);
      if (params?.area && params.area !== 'All') q.set('area', params.area);

      const res = await fetch(`${API_BASE}/requests?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        saveLocalRequests(data);
        return data;
      }
    } catch (e) {
      console.warn("Backend API unavailable, using local store", e);
    }

    // Local fallback
    let list = getLocalRequests();
    if (params?.search) {
      const s = params.search.toLowerCase();
      list = list.filter(r =>
        r.id.toLowerCase().includes(s) ||
        r.customer_name.toLowerCase().includes(s) ||
        r.items_description.toLowerCase().includes(s) ||
        r.area.toLowerCase().includes(s) ||
        r.address.toLowerCase().includes(s)
      );
    }
    if (params?.priority && params.priority !== 'All') {
      list = list.filter(r => r.priority.toUpperCase() === params.priority!.toUpperCase());
    }
    if (params?.status && params.status !== 'All') {
      list = list.filter(r => r.status.toLowerCase() === params.status!.toLowerCase());
    }
    if (params?.category && params.category !== 'All') {
      list = list.filter(r => r.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.area && params.area !== 'All') {
      list = list.filter(r => r.area.toLowerCase() === params.area!.toLowerCase());
    }
    return list;
  },

  async getRequestById(id: string): Promise<PickupRequest | null> {
    try {
      const res = await fetch(`${API_BASE}/requests/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API unavailable", e);
    }
    const list = getLocalRequests();
    return list.find(r => r.id === id) || null;
  },

  async createRequest(payload: CreatePickupPayload): Promise<PickupRequest> {
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        const list = getLocalRequests();
        saveLocalRequests([created, ...list]);
        return created;
      }
    } catch (e) {
      console.warn("Backend API unavailable, creating locally", e);
    }

    // Local creation
    const list = getLocalRequests();
    const nextNum = 1054 + list.length;
    const newId = `WW${nextNum}`;
    const isSpecial = payload.category === 'Hazardous' || payload.category === 'E-Waste';
    const pri = isSpecial ? 'HIGH' : 'NORMAL';
    const score = isSpecial ? 85 : 35;
    const reason = isSpecial
      ? `${payload.category} handling risk (+${isSpecial ? 40 : 10}) + scheduled tomorrow (+20) + standard volume (+5)`
      : "Standard recyclables (+10) + scheduled tomorrow (+20) + standard volume (+5)";

    const newReq: PickupRequest = {
      id: newId,
      customer_name: payload.customer_name,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      area: payload.area,
      landmark: payload.landmark,
      pin_code: payload.pin_code,
      category: payload.category,
      items_description: payload.items_description,
      quantity: payload.quantity,
      quantity_unit: payload.quantity_unit,
      pickup_date: payload.pickup_date,
      pickup_slot: payload.pickup_slot,
      status: 'Requested',
      priority: pri,
      priority_score: score,
      priority_reason: reason,
      batch_id: null,
      created_at: new Date().toISOString(),
      waiting_days: 0,
      notes: payload.notes,
      journey: [
        {
          step: "Request Submitted",
          timestamp: "27 Sept 2026, 12:45 PM",
          status: "completed",
          description: `Submitted via WasteWise Smart Triage (${payload.items_description}).`
        },
        {
          step: "Request Reviewed",
          timestamp: "27 Sept 2026, 12:45 PM",
          status: "completed",
          description: `Automated priority engine set score to ${score} [${pri}].`
        },
        {
          step: "Collector Assigned",
          status: "pending",
          description: "Awaiting collection batch formation."
        },
        {
          step: "Pickup Scheduled",
          status: "pending",
          description: `Booked for ${payload.pickup_date}, ${payload.pickup_slot}.`
        },
        {
          step: "Waste Collected",
          status: "pending",
          description: "Pending doorstep verification."
        },
        {
          step: "Recycled / Processed",
          status: "pending",
          description: `To be transferred to designated ${payload.category} facility.`
        }
      ]
    };

    saveLocalRequests([newReq, ...list]);
    return newReq;
  },

  async updateStatus(id: string, status: RequestStatus, notes?: string): Promise<PickupRequest | null> {
    try {
      const res = await fetch(`${API_BASE}/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        const updated = await res.json();
        const list = getLocalRequests().map(r => r.id === id ? updated : r);
        saveLocalRequests(list);
        return updated;
      }
    } catch (e) {
      console.warn("Backend API unavailable, updating locally", e);
    }

    const list = getLocalRequests();
    const req = list.find(r => r.id === id);
    if (!req) return null;

    req.status = status;
    const nowStr = "27 Sept 2026, 01:15 PM";
    let found = false;
    for (const step of req.journey) {
      if (step.step.toLowerCase() === status.toLowerCase()) {
        step.status = 'completed';
        step.timestamp = nowStr;
        if (notes) step.description = notes;
        found = true;
        break;
      }
    }
    if (!found) {
      req.journey.push({
        step: status,
        timestamp: nowStr,
        status: 'completed',
        description: notes || `Status updated to ${status} by operator.`
      });
    }

    if (status === 'Processed') {
      req.journey[req.journey.length - 1].facility = `Pune Eco-Recovery Facility (${req.area} Sector)`;
      req.journey[req.journey.length - 1].certificate_id = `CER-WW-2026-${req.id}`;
    }

    saveLocalRequests([...list]);
    return req;
  },

  async getBatches(): Promise<CollectionBatch[]> {
    try {
      const res = await fetch(`${API_BASE}/batches`);
      if (res.ok) {
        const data = await res.json();
        saveLocalBatches(data);
        return data;
      }
    } catch (e) {
      console.warn("Backend API unavailable", e);
    }
    return getLocalBatches();
  },

  async getRecommendations(): Promise<BatchRecommendation[]> {
    try {
      const res = await fetch(`${API_BASE}/batches/recommendations`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API unavailable", e);
    }

    // Local recommendation calculation
    const reqs = getLocalRequests().filter(
      r => !r.batch_id && ['Requested', 'Reviewed', 'Assigned', 'Scheduled'].includes(r.status)
    );
    const groups: Record<string, PickupRequest[]> = {};
    for (const r of reqs) {
      const key = `${r.area}___${r.pickup_date}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    }

    const recs: BatchRecommendation[] = [];
    for (const [key, group] of Object.entries(groups)) {
      if (group.length >= 2) {
        const [area, date] = key.split('___');
        const hasHigh = group.some(r => r.priority === 'HIGH');
        const hasMed = group.some(r => r.priority === 'MEDIUM');
        const pri = hasHigh ? 'HIGH' : hasMed ? 'MEDIUM' : 'NORMAL';
        const cats = Array.from(new Set(group.map(r => r.category)));
        const highCount = group.filter(r => r.priority === 'HIGH').length;

        recs.push({
          batch_key: key,
          area,
          pickup_date: date,
          request_ids: group.map(r => r.id),
          requests_count: group.length,
          priority: pri,
          reason: hasHigh
            ? `Combines ${group.length} pickups in ${area} (${highCount} urgent/high priority) to prevent separate truck dispatch.`
            : `Combines ${group.length} pickups in ${area} for single-route logistical efficiency and reduced carbon emissions.`,
          categories: cats
        });
      }
    }
    return recs;
  },

  async createBatch(area: string, pickup_date: string, request_ids: string[]): Promise<CollectionBatch> {
    try {
      const res = await fetch(`${API_BASE}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area,
          pickup_date,
          request_ids,
          assigned_vehicle: "MH-12-WW-4028",
          assigned_collector: "Pawan Jadhav (Route Lead)"
        })
      });
      if (res.ok) {
        const batch = await res.json();
        const batches = getLocalBatches();
        saveLocalBatches([batch, ...batches]);
        return batch;
      }
    } catch (e) {
      console.warn("Backend API unavailable, creating batch locally", e);
    }

    // Local batch creation
    const batches = getLocalBatches();
    const batchId = `B-00${batches.length + 1}`;
    const newBatch: CollectionBatch = {
      id: batchId,
      area,
      pickup_date,
      request_ids,
      requests_count: request_ids.length,
      priority: 'HIGH',
      status: 'Assigned',
      assigned_vehicle: 'MH-12-WW-4028',
      assigned_collector: 'Pawan Jadhav (Route Lead)',
      created_at: new Date().toISOString()
    };

    saveLocalBatches([newBatch, ...batches]);

    // Update requests
    const reqs = getLocalRequests();
    for (const r of reqs) {
      if (request_ids.includes(r.id)) {
        r.batch_id = batchId;
        r.status = 'Assigned';
        const nowStr = "27 Sept 2026, 01:20 PM";
        for (const st of r.journey) {
          if (st.step === 'Collector Assigned') {
            st.status = 'completed';
            st.timestamp = nowStr;
            st.description = `Assigned to Batch ${batchId} (Driver: Pawan Jadhav, Vehicle: MH-12-WW-4028)`;
          }
        }
      }
    }
    saveLocalRequests([...reqs]);

    return newBatch;
  },

  async getAnalytics(): Promise<AnalyticsOverview> {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API unavailable", e);
    }

    const reqs = getLocalRequests();
    const total = reqs.length;
    const pending = reqs.filter(r => ['Requested', 'Reviewed'].includes(r.status)).length;
    const highPri = reqs.filter(r => r.priority === 'HIGH').length;
    const completed = reqs.filter(r => ['Collected', 'Processed'].includes(r.status)).length;
    const today = reqs.filter(r => r.pickup_date === '2026-09-27' || r.pickup_date.includes('today')).length;
    const needsAttention = reqs.filter(r => r.priority === 'HIGH' || r.waiting_days >= 2).length;

    const catDist: Record<string, number> = {};
    const statDist: Record<string, number> = {};
    const areaDist: Record<string, number> = {};

    for (const r of reqs) {
      catDist[r.category] = (catDist[r.category] || 0) + 1;
      statDist[r.status] = (statDist[r.status] || 0) + 1;
      areaDist[r.area] = (areaDist[r.area] || 0) + 1;
    }

    return {
      total_requests: total,
      pending_requests: pending,
      high_priority_count: highPri,
      today_pickups: today,
      completed_pickups: completed,
      waste_diverted_kg: 24.5,
      co2_avoided_kg: 9.8,
      on_schedule_percentage: 83,
      needs_attention_count: needsAttention,
      category_distribution: catDist,
      status_distribution: statDist,
      area_distribution: areaDist
    };
  },

  async resetData(): Promise<void> {
    try {
      await fetch(`${API_BASE}/reset`, { method: 'POST' });
    } catch (e) {
      console.warn("Backend API unavailable", e);
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_reqs');
    localStorage.removeItem(LOCAL_STORAGE_KEY + '_batches');
  }
};

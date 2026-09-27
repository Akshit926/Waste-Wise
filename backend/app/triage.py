import re
from typing import List, Tuple
from .models import WasteCategory, PriorityLevel, WasteItemIdentified, TriageResponse

# Keyword taxonomy mapping keywords to (Category, Special Handling, Guidance, Risk Score)
KEYWORD_RULES = [
    # E-Waste (Risk Score 30)
    (
        [
            "laptop", "notebook", "macbook", "computer", "pc", "desktop", "cpu", "motherboard",
            "phone", "smartphone", "mobile", "iphone", "android", "tablet", "ipad",
            "charger", "adapter", "powerbank", "cable", "cord", "wire", "keyboard", "mouse",
            "monitor", "display", "screen", "television", "tv", "printer", "scanner", "cartridge",
            "hard drive", "ssd", "hdd", "ram", "pen drive", "usb", "electronic", "gadget",
            "headphones", "earbuds", "earphones", "microwave", "oven", "toaster", "blender",
            "mixer", "kettle", "iron", "camera", "smartwatch", "game console", "playstation", "xbox"
        ],
        WasteCategory.E_WASTE,
        True,
        "Contains heavy metals, printed circuit boards and recyclable silicon. Do not dispose with general household garbage. Pack securely to prevent screen breakage or leakage.",
        30,
        "Schedule Certified E-Waste Collection"
    ),
    # Hazardous (Risk Score 40)
    (
        [
            "battery", "batteries", "cell", "lithium", "lead acid", "car battery", "aa battery", "aaa battery",
            "paint", "paint can", "primer", "enamel", "varnish", "chemical", "solvent", "thinner",
            "turpentine", "bleach", "detergent", "ammonia", "drain cleaner", "acid", "battery acid",
            "pesticide", "insecticide", "fertilizer", "weed killer", "herbicide", "rat poison",
            "medicine", "medicines", "expired medicine", "syrup", "pills", "tablets", "pharma",
            "syringe", "needle", "thermometer", "mercury", "fluorescent", "tube light", "cfl",
            "aerosol", "spray can", "motor oil", "engine oil", "coolant", "brake fluid", "flammable"
        ],
        WasteCategory.HAZARDOUS,
        True,
        "Hazardous & toxic materials pose severe environmental and chemical burn hazards. Keep away from heat and moisture. Store upright in a leak-proof container; do NOT mix chemicals.",
        40,
        "Schedule Dedicated Hazardous Waste Pickup"
    ),
    # Plastic (Risk Score 10)
    (
        [
            "plastic", "bottle", "bottles", "water bottle", "pet bottle", "container", "jug", "tub",
            "packaging", "polythene", "polybag", "plastic bag", "wrapper", "chips packet",
            "shampoo bottle", "detergent jug", "plastic cup", "straw", "cutlery", "styrofoam",
            "thermocol", "bubble wrap", "pvc", "plastic sheet", "tupperware", "takeaway container"
        ],
        WasteCategory.PLASTIC,
        False,
        "Rinse and dry all plastic containers to remove food residues. Flatten bottles to save volume. Segregate rigid plastic from film wrappers for optimal recycling.",
        10,
        "Schedule Recyclable Plastic Collection"
    ),
    # Organic (Risk Score 15)
    (
        [
            "food", "food waste", "leftover", "vegetable", "vegetables", "veggies", "fruit", "fruits",
            "kitchen waste", "peel", "peels", "banana peel", "apple core", "potato peel",
            "eggshell", "egg shells", "tea bag", "tea leaves", "coffee grounds", "garden waste",
            "dry leaves", "green leaves", "twigs", "flowers", "grass clippings", "compost", "bread",
            "rice", "curry", "spoiled food", "meat scrap", "fish bones"
        ],
        WasteCategory.ORGANIC,
        False,
        "Biodegradable wet waste. Drain excess liquid before packing in compostable or paper lining. Keep separate from dry recyclables to prevent contamination and odor.",
        15,
        "Direct to Municipal Wet Composting / Bio-Bin"
    ),
    # Paper (Risk Score 10)
    (
        [
            "paper", "newspaper", "cardboard", "box", "boxes", "carton", "corrugated box",
            "magazine", "magazines", "book", "books", "notebook", "office paper", "a4 paper",
            "document", "shredded paper", "envelope", "pamphlet", "brochure", "paper bag"
        ],
        WasteCategory.PAPER,
        False,
        "Keep paper dry and unsoiled. Flatten all corrugated cardboard boxes and bundle newspapers with natural twine.",
        10,
        "Schedule Dry Paper & Cardboard Pickup"
    ),
    # Bulk Waste (Risk Score 20)
    (
        [
            "chair", "sofa", "couch", "mattress", "bed", "bedsheet", "pillow", "cushion",
            "table", "desk", "wardrobe", "cupboard", "cabinet", "closet", "bookshelf",
            "furniture", "wooden", "plywood", "carpet", "rug", "door", "window frame",
            "large appliance", "refrigerator", "washing machine", "air conditioner", "ac"
        ],
        WasteCategory.BULK,
        True,
        "Oversized bulky waste requiring heavy collection logistics and multi-person handling. Ensure clear curbside or elevator access.",
        20,
        "Schedule Heavy Logistics / Bulk Pickup"
    ),
    # Metal (Risk Score 10)
    (
        [
            "metal", "can", "cans", "tin", "aluminium", "aluminum", "steel", "iron",
            "copper", "brass", "foil", "tin foil", "scrap metal", "wire mesh", "utensil", "pots", "pans"
        ],
        WasteCategory.METAL,
        False,
        "100% recyclable high-value scrap. Clean away any sticky grease and separate ferrous (magnetic) from non-ferrous scrap if possible.",
        10,
        "Schedule Scrap Metal Reclamation"
    ),
    # Glass (Risk Score 10)
    (
        [
            "glass", "broken glass", "jar", "glass jar", "wine bottle", "beer bottle",
            "glass bottle", "mirror", "window glass", "beaker", "flask", "crockery"
        ],
        WasteCategory.GLASS,
        True,
        "Fragile sharp hazard. Wrap broken glass securely in heavy paper or corrugated box and label clearly as 'SHARP GLASS' for worker safety.",
        10,
        "Schedule Protected Glass Collection"
    )
]

def classify_waste_text(text: str) -> TriageResponse:
    cleaned = text.lower()
    identified_items: List[WasteItemIdentified] = []
    seen_categories = set()
    highest_risk = 10
    special_handling_flag = False

    # Check for keyword matches across categories
    for keywords, category, needs_special_handling, guidance, risk_score, action in KEYWORD_RULES:
        for kw in keywords:
            # Word boundary check for precise matching
            pattern = r'\b' + re.escape(kw) + r'\b'
            if re.search(pattern, cleaned):
                # Clean matched item name
                item_display_name = kw.title()
                # Avoid duplicate identical items
                if not any(item.item_name.lower() == item_display_name.lower() for item in identified_items):
                    identified_items.append(
                        WasteItemIdentified(
                            item_name=item_display_name,
                            category=category,
                            special_handling=needs_special_handling,
                            handling_guidance=guidance,
                            risk_score=risk_score
                        )
                    )
                    seen_categories.add(category)
                    if needs_special_handling:
                        special_handling_flag = True
                    if risk_score > highest_risk:
                        highest_risk = risk_score
                break  # Matched one keyword in this category rule, move to next or keep scanning other terms

    # Fallback if no specific keyword triggered
    if not identified_items:
        # Default assessment
        primary_category = WasteCategory.PLASTIC
        action = "Schedule General Recyclable Pickup"
        guidance = "Separate into dry recyclable and wet organic bins. If containing electronic or battery components, request special e-waste handling."
        identified_items.append(
            WasteItemIdentified(
                item_name=text.strip()[:35] if text.strip() else "Unspecified Waste",
                category=primary_category,
                special_handling=False,
                handling_guidance=guidance,
                risk_score=10
            )
        )
    else:
        # Sort identified items by risk score descending
        identified_items.sort(key=lambda x: x.risk_score, reverse=True)
        primary_category = identified_items[0].category

    # Determine recommended action & summary guidance
    if special_handling_flag:
        special_names = [i.item_name for i in identified_items if i.special_handling]
        summary_guidance = (
            f"Special handling required for {', '.join(special_names)}. "
            f"Do not mix with general household waste. Regulated handling protocols apply."
        )
        if WasteCategory.HAZARDOUS in seen_categories:
            recommended_action = "Schedule Certified Hazardous Waste Pickup"
            suggested_priority = PriorityLevel.HIGH
        elif WasteCategory.E_WASTE in seen_categories:
            recommended_action = "Schedule Specialized E-Waste Collection"
            suggested_priority = PriorityLevel.HIGH
        elif WasteCategory.BULK in seen_categories:
            recommended_action = "Schedule Heavy Logistics / Bulk Collection"
            suggested_priority = PriorityLevel.MEDIUM
        else:
            recommended_action = "Schedule Protected Fragile/Sharp Waste Pickup"
            suggested_priority = PriorityLevel.MEDIUM
    else:
        summary_guidance = (
            f"Standard recyclable/compostable stream. Clean and segregate before pickup window."
        )
        recommended_action = f"Schedule Standard {primary_category.value} Pickup"
        suggested_priority = PriorityLevel.NORMAL

    return TriageResponse(
        query=text,
        identified_items=identified_items,
        primary_category=primary_category,
        is_special_handling=special_handling_flag,
        summary_guidance=summary_guidance,
        recommended_action=recommended_action,
        suggested_priority=suggested_priority,
        risk_score=highest_risk
    )

export type WasteCategory =
  | 'E-Waste'
  | 'Hazardous'
  | 'Plastic'
  | 'Organic'
  | 'Paper'
  | 'Bulk Waste'
  | 'Metal'
  | 'Glass';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'NORMAL';

export type RequestStatus =
  | 'Requested'
  | 'Reviewed'
  | 'Assigned'
  | 'Scheduled'
  | 'Out for Pickup'
  | 'Collected'
  | 'Processed'
  | 'Cancelled';

export interface WasteItemIdentified {
  item_name: string;
  category: WasteCategory;
  special_handling: boolean;
  handling_guidance: string;
  risk_score: number;
}

export interface TriageResponse {
  query: string;
  identified_items: WasteItemIdentified[];
  primary_category: WasteCategory;
  is_special_handling: boolean;
  summary_guidance: string;
  recommended_action: string;
  suggested_priority: PriorityLevel;
  risk_score: number;
}

export interface WasteJourneyStep {
  step: string;
  timestamp?: string | null;
  status: 'completed' | 'in_progress' | 'pending';
  description: string;
  facility?: string | null;
  certificate_id?: string | null;
}

export interface PickupRequest {
  id: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  address: string;
  area: string;
  landmark?: string | null;
  pin_code: string;
  category: WasteCategory;
  items_description: string;
  quantity: number;
  quantity_unit: string;
  pickup_date: string;
  pickup_slot: string;
  status: RequestStatus;
  priority: PriorityLevel;
  priority_score: number;
  priority_reason: string;
  batch_id?: string | null;
  created_at: string;
  waiting_days: number;
  notes?: string | null;
  journey: WasteJourneyStep[];
}

export interface CollectionBatch {
  id: string;
  area: string;
  pickup_date: string;
  request_ids: string[];
  requests_count: number;
  priority: PriorityLevel;
  status: string;
  assigned_vehicle: string;
  assigned_collector: string;
  created_at: string;
}

export interface BatchRecommendation {
  batch_key: string;
  area: string;
  pickup_date: string;
  request_ids: string[];
  requests_count: number;
  priority: PriorityLevel;
  reason: string;
  categories: string[];
}

export interface AnalyticsOverview {
  total_requests: number;
  pending_requests: number;
  high_priority_count: number;
  today_pickups: number;
  completed_pickups: number;
  waste_diverted_kg: number;
  co2_avoided_kg: number;
  on_schedule_percentage: number;
  needs_attention_count: number;
  category_distribution: Record<string, number>;
  status_distribution: Record<string, number>;
  area_distribution: Record<string, number>;
}

export interface CreatePickupPayload {
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  landmark?: string;
  pin_code: string;
  category: WasteCategory;
  items_description: string;
  quantity: number;
  quantity_unit: string;
  pickup_date: string;
  pickup_slot: string;
  notes?: string;
}

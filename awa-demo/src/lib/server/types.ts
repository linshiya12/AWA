// AWA Data Models & Schemas — Source of truth: 07-DATABASE.md & 08-API.md

// ==========================================
// PUBLIC DATABASE MODELS
// ==========================================

export interface Category {
  category_id: string;
  parent_id: string | null;
  name: string;
  description: string;
  position: number;
  is_visible: boolean;
  preview_media_id: string | null;
  path: string;
  depth: number;
  extra_prompt_words?: string; // 04-FEATURES.md §5.1
}

export interface Template {
  template_id: string;
  category_id: string;
  name: string;
  description: string;
  preview_media_id: string | null;
  preview_image?: string; // presentation URL
  status: 'draft' | 'published' | 'hidden' | 'archived';
  current_version_id: string | null; // soft reference into PRIVATE database
  position: number;
  is_sample: boolean; // 05-MVP.md §3.3: 3 free sample templates readable without subscription
  likes: number;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface TemplateAttribute {
  attribute_id: string;
  template_id: string;
  attribute_type: string; // style, mood, format, difficulty (04-FEATURES.md §5.2 & 07-DATABASE.md §4.3)
  attribute_value: string;
}

export interface AiTool {
  tool_id: string;
  name: string;
  destination: string;
  reasoning: string; // Required by FEAT-016
  pricing_note: string;
  quality_note: string;
  logo_media_id: string | null;
  is_available: boolean;
}

export interface AiModel {
  model_id: string;
  tool_id: string;
  name: string;
  is_available: boolean;
}

export interface ToolAssignment {
  assignment_id: string;
  scope_type: 'category' | 'template';
  scope_id: string;
  tool_id: string;
  model_id: string | null;
  position: number;
  reasoning_override: string | null;
  is_active: boolean;
}

export interface Guidance {
  guidance_id: string;
  scope_type: 'category' | 'template';
  scope_id: string;
  presentation: 'written' | 'recorded' | 'both';
  media_id: string | null;
  is_active: boolean;
}

export interface GuidanceStep {
  step_id: string;
  guidance_id: string;
  position: number;
  instruction: string;
  title?: string;
  tip?: string;
  media_id?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  media?: MediaAsset | null;
}

export interface MediaAsset {
  media_id: string;
  storage_reference: string;
  kind: 'image' | 'video';
  original_filename: string;
  size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Language {
  language_id: string; // e.g. 'en', 'es', 'fr', 'ml'
  name: string;
  is_default: boolean; // Exactly one has is_default = true (07 V19)
  is_enabled: boolean;
}

export interface Translation {
  translation_id: string;
  language_id: string;
  entity_type: 'category' | 'template' | 'guidance_step' | 'ai_tool';
  entity_id: string;
  field_name: string; // name, description, instruction, reasoning
  translated_text: string;
}

// ==========================================
// PRIVATE DATABASE MODELS
// ==========================================

export interface TemplateVersion {
  version_id: string;
  template_id: string; // soft reference into public store
  version_number: number;
  prompt_text: string; // THE PRODUCT: Never in public database!
  ui_prompt?: string | null; // UI & Implementation prompt for website templates
  context_prompt?: string | null; // Business context & content prompt for website templates
  change_note: string | null;
  authored_by: string;
  is_current: boolean;
  created_at: string;
}

export interface User {
  user_id: string;
  email: string;
  display_name: string | null;
  role: 'member' | 'administrator'; // 07-DATABASE.md §5.2: Two roles only
  status: 'active' | 'suspended';
  preferred_language_id: string | null;
  created_at: string;
  last_seen_at: string;
  allowance_balance: number;
}

export interface Session {
  session_id: string;
  user_id: string;
  started_at: string;
  last_seen_at: string;
  ended_at: string | null;
  ended_reason: string | null;
}

export interface Plan {
  plan_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  term_length: string; // 'yearly' | 'lifetime'
  initial_allowance: number;
  is_available: boolean;
}

export interface CreditPack {
  pack_id: string;
  name: string;
  price: number;
  currency: string;
  units: number;
  is_available: boolean;
}

export interface Subscription {
  subscription_id: string;
  user_id: string;
  plan_id: string;
  state: 'active' | 'ended' | 'cancelled';
  started_at: string;
  ends_at: string;
  end_behaviour: 'retain_delivered'; // 05-MVP.md §3.3
  allowance_balance: number;
}

export interface SubscriptionWithDetails extends Subscription {
  user: {
    user_id: string;
    email: string;
    display_name: string | null;
    status: 'active' | 'suspended';
    role: 'member' | 'administrator';
  };
  plan: {
    plan_id: string;
    name: string;
    price: number;
    currency: string;
    term_length: string;
    initial_allowance: number;
  };
  latest_transaction?: {
    transaction_id: string;
    provider_reference: string;
    amount: number;
    currency: string;
    state: 'succeeded' | 'pending' | 'failed';
    occurred_at: string;
  } | null;
  is_lifetime: boolean;
  days_remaining: number | null;
  is_expiring_soon: boolean;
}

export interface SubscriptionReportMetrics {
  period: string;
  date_from: string | null;
  date_to: string | null;
  active_subscriptions: number;
  expired_subscriptions: number;
  upcoming_expirations: number;
  new_subscriptions: number;
  renewals: number;
  total_revenue: number;
  currency: string;
  revenue_note: string;
  plan_breakdown: Array<{
    plan_id: string;
    plan_name: string;
    term_length: string;
    price: number;
    currency: string;
    total_subscribers: number;
    active_subscribers: number;
    revenue: number;
    revenue_share_percentage: number;
  }>;
}

export interface PaymentTransaction {
  transaction_id: string;
  user_id: string;
  purchase_type: 'plan' | 'credit_pack';
  purchase_id: string;
  provider_reference: string;
  amount: number;
  currency: string;
  state: 'succeeded' | 'pending' | 'failed';
  occurred_at: string;
}

export interface PaymentConfiguration {
  configuration_id: string;
  provider: 'razorpay';
  mode: 'test' | 'live';
  key_id: string;
  key_secret: string; // WRITE-ONLY: never returned on reads!
  webhook_secret: string; // WRITE-ONLY
  is_enabled: boolean;
  last_verified_at: string | null;
}

export interface DeliveredPrompt {
  delivered_prompt_id: string;
  user_id: string;
  template_id: string;
  base_version_id: string;
  prompt_text: string;
  ui_prompt?: string | null;
  context_prompt?: string | null;
  is_customized: boolean;
  parent_delivered_prompt_id: string | null;
  delivered_at: string;
}

export interface CustomizationAttempt {
  attempt_id: string;
  user_id: string;
  source_delivered_prompt_id: string;
  request_text: string;
  outcome: 'succeeded' | 'unusable' | 'failed';
  resulting_delivered_prompt_id: string | null;
  allowance_consumed: boolean;
  service_cost: number | null;
  service_reference: string | null;
  attempted_at: string;
}

export interface AllowanceLedgerEntry {
  entry_id: string;
  user_id: string;
  change: number;
  reason: 'initial_grant' | 'purchase' | 'hold' | 'consume' | 'release' | 'support_adjustment';
  related_attempt_id?: string | null;
  related_transaction_id?: string | null;
  actor_id?: string | null; // set on support adjustments
  occurred_at: string;
  note?: string | null;
}

export interface SpendPeriod {
  period_id: string;
  period_start: string;
  period_end: string;
  limit: number;
  spent: number;
  notified_at: string | null;
}

export interface Feedback {
  feedback_id: string;
  delivered_prompt_id: string; // Attaches to delivered_prompt, NOT template_version! (07 §6.5)
  user_id: string;
  outcome: 'worked' | 'did_not_work';
  comment: string | null;
  submitted_at: string;
}

export interface UnmetNeed {
  unmet_need_id: string;
  user_id: string | null;
  category_id: string;
  description: string;
  submitted_at: string;
}

export interface AuditLogEntry {
  audit_id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  occurred_at: string;
}

// ==========================================
// COLLECTION MANAGEMENT MODELS (07 & Admin Spec)
// ==========================================

export interface CuratedCollection {
  collection_id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string | null;
  is_active: boolean; // Active appears in recommendations; Inactive is excluded
  position: number; // Display order
  template_ids: string[]; // Ordered list of template IDs, no duplicates
  created_at: string;
  updated_at: string;
  created_by: string; // User ID of creating admin
}

export interface UserCollection {
  collection_id: string;
  user_id: string;
  name: string;
  description?: string | null;
  template_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface UserCollectionWithDetails extends UserCollection {
  user: {
    user_id: string;
    email: string;
    display_name: string | null;
  };
  templates: Array<{
    template_id: string;
    name: string;
    description: string;
    preview_image?: string;
    mainCategory?: string;
    difficulty?: string;
  }>;
}


// Types shared across all VirtualSMS automation integrations.
// Verified against the live API on 2026-05-24 via end-to-end purchase + cancel.
// Source: ws-gateway/handlers/customer_api.go in the VirtualSMS-local repo.

export interface VirtualSmsClientOptions {
  apiKey: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

// GET /api/v1/customer/services → { services: ServiceCatalogItem[] }
export interface ServiceCatalogItem {
  service_id: string;     // short code like "wa", "tg", "aws"
  service_name: string;   // human label like "Whatsapp", "Telegram"
  base_price: number;
}

// GET /api/v1/customer/countries → { countries: CountryCatalogItem[] }
export interface CountryCatalogItem {
  country_id: string;     // ISO code like "US", "GB", "AR"
  country_name: string;
  min_price: number;
  services: string[];     // service_id codes supported in this country
}

// GET /api/v1/customer/balance → { balance, success }
export interface BalanceResponse {
  balance: number;
  success: boolean;
}

// POST /api/v1/customer/purchase
// body: { country, service } — both required, both case-sensitive
export interface PurchaseInput {
  country: string;        // ISO code, e.g. "US"
  service: string;        // service_id, e.g. "wa"
}

// 2xx response shape
export interface PurchaseResponse {
  success: boolean;
  order_id: string;       // UUID
  phone_number: string;   // E.164-ish, e.g. "541127399874"
  country: string;
  service: string;
  price: number;
  status: OrderStatus;    // always "waiting" on fresh purchase
  created_at: string;     // RFC3339
  expires_at: string;     // RFC3339
  cancel_available_at: string;
  swap_available_at: string;
  rules: { cancel_cooldown_seconds: number; swap_cooldown_seconds: number };
}

// GET /api/v1/customer/order/{order_id}
// Adds messages[] and sms_received bool. The bool is informational only —
// observed live, an order can have status="completed" with non-empty messages
// and sms_received=false simultaneously. Trust the messages array for content
// and the status field for state, not the bool.
export interface OrderStatusResponse extends PurchaseResponse {
  sms_received: boolean;
  messages?: OrderSmsMessage[];
}

export interface OrderSmsMessage {
  sender: string;        // may be empty string
  content: string;       // full SMS body
  received_at: string;   // RFC3339
}

// Verified live 2026-05-24: the terminal "SMS arrived" status is "completed",
// not "received". The gateway uses "completed" both for SMS-received-successfully
// and for explicit done. There is no separate "received" state.
export type OrderStatus =
  | "waiting"
  | "completed"
  | "expired"
  | "cancelled";

// POST /api/v1/customer/cancel/{order_id}
export interface CancelResponse {
  success: boolean;
  order_id: string;
  status: "cancelled";
  refund_amount: number;
}

// GET /api/v1/customer/orders?limit=N
// Note: response uses *_id suffix (service_id, country_id), unlike the
// purchase/order-status responses which use bare service/country.
export interface OrderListItem {
  id: string;             // UUID
  phone_number: string;
  service_id: string;
  country_id: string;
  status: OrderStatus;
  price_charged: number;
  created_at: string;
  expires_at: string;
  cancel_available_at?: string;
  swap_available_at?: string;
  rules?: { cancel_cooldown_seconds: number; swap_cooldown_seconds: number };
}

export interface OrderListResponse {
  count: number;
  orders: OrderListItem[];
}

// GET /api/v1/price?service=&country=
export interface PriceCheckResponse {
  success: boolean;
  service: string;
  country: string;
  service_name?: string;
  country_name?: string;
  price?: number;
  estimated?: boolean;
  error?: string;
}

export class VirtualSmsApiError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string, message?: string) {
    super(message || `VirtualSMS API ${status}: ${body}`);
    this.name = "VirtualSmsApiError";
    this.status = status;
    this.body = body;
  }
}

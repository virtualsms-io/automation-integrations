import {
  BalanceResponse,
  CancelResponse,
  CountryCatalogItem,
  OrderListResponse,
  OrderStatusResponse,
  PriceCheckResponse,
  PurchaseInput,
  PurchaseResponse,
  ServiceCatalogItem,
  VirtualSmsApiError,
  VirtualSmsClientOptions,
} from "./types";

const DEFAULT_BASE_URL = "https://virtualsms.io";
const DEFAULT_USER_AGENT = "virtualsms-automation-integrations/0.2.0";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class VirtualSmsClient {
  private apiKey: string;
  private baseUrl: string;
  private fetchImpl: typeof fetch;
  private userAgent: string;

  constructor(opts: VirtualSmsClientOptions) {
    if (!opts.apiKey) {
      throw new Error("VirtualSmsClient: apiKey is required");
    }
    this.apiKey = opts.apiKey;
    this.baseUrl = (opts.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.userAgent = opts.userAgent || DEFAULT_USER_AGENT;
    const f = opts.fetchImpl || (globalThis as { fetch?: typeof fetch }).fetch;
    if (!f) {
      throw new Error(
        "VirtualSmsClient: global fetch not available. Provide fetchImpl in options.",
      );
    }
    this.fetchImpl = f;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
    authed = true,
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    if (query && Object.keys(query).length > 0) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null && v !== "") {
          params.set(k, String(v));
        }
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": this.userAgent,
    };
    if (authed) headers["X-API-Key"] = this.apiKey;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const resp = await this.fetchImpl(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const text = await resp.text();
    if (!resp.ok) {
      throw new VirtualSmsApiError(resp.status, text);
    }
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  getBalance(): Promise<BalanceResponse> {
    return this.request<BalanceResponse>("GET", "/api/v1/customer/balance");
  }

  listServices(): Promise<{ services: ServiceCatalogItem[] }> {
    return this.request<{ services: ServiceCatalogItem[] }>(
      "GET",
      "/api/v1/customer/services",
    );
  }

  listCountries(): Promise<{ countries: CountryCatalogItem[] }> {
    return this.request<{ countries: CountryCatalogItem[] }>(
      "GET",
      "/api/v1/customer/countries",
    );
  }

  checkPrice(
    service: string,
    country: string,
  ): Promise<PriceCheckResponse> {
    return this.request<PriceCheckResponse>(
      "GET",
      "/api/v1/price",
      undefined,
      { service, country },
      /* authed */ false,
    );
  }

  buyNumber(input: PurchaseInput): Promise<PurchaseResponse> {
    return this.request<PurchaseResponse>(
      "POST",
      "/api/v1/customer/purchase",
      input,
    );
  }

  getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    if (!UUID_RE.test(orderId)) {
      throw new Error("VirtualSmsClient.getOrderStatus: orderId must be a UUID");
    }
    return this.request<OrderStatusResponse>(
      "GET",
      `/api/v1/customer/order/${orderId}`,
    );
  }

  cancelOrder(orderId: string): Promise<CancelResponse> {
    if (!UUID_RE.test(orderId)) {
      throw new Error("VirtualSmsClient.cancelOrder: orderId must be a UUID");
    }
    return this.request<CancelResponse>(
      "POST",
      `/api/v1/customer/cancel/${orderId}`,
    );
  }

  listOrders(opts?: { limit?: number }): Promise<OrderListResponse> {
    return this.request<OrderListResponse>(
      "GET",
      "/api/v1/customer/orders",
      undefined,
      { limit: opts?.limit },
    );
  }
}

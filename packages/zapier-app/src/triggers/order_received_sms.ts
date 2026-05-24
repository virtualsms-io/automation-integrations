import { apiBase, ZBundle, ZObject } from "../types";

interface OrderRow {
  id: string;
  status: string;
  phone_number?: string;
  service_id?: string;
  country_id?: string;
  price_charged?: number;
  created_at?: string;
  expires_at?: string;
}

interface OrderListResp {
  orders?: OrderRow[];
}

const orderReceivedSms = {
  key: "order_received_sms",
  noun: "Order",
  display: {
    label: "Order Received SMS",
    description:
      "Polling — fires once per order that newly transitions to status=completed (the VirtualSMS terminal state when an SMS arrives).",
  },
  operation: {
    type: "polling" as const,
    perform: async (z: ZObject, bundle: ZBundle) => {
      const resp = await z.request<OrderListResp>({
        url: `${apiBase(bundle)}/api/v1/customer/orders`,
        method: "GET",
        params: { limit: 100 },
      });
      resp.throwForStatus();
      // VirtualSMS marks SMS-received orders as status="completed", not
      // "received". Verified live 2026-05-24.
      return (resp.data.orders ?? [])
        .filter((o) => o.status === "completed")
        .map((o) => ({ ...o })); // Zapier dedupes on `id` (already present)
    },
    sample: {
      id: "f3c1cf52-ec0b-4908-83ff-58a2217a6633",
      phone_number: "541126335599",
      service_id: "wa",
      country_id: "AR",
      status: "completed",
      price_charged: 0.8,
      created_at: "2026-05-21T19:21:56Z",
      expires_at: "2026-05-21T19:41:56Z",
    },
  },
};

export default orderReceivedSms;

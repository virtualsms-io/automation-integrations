import { apiBase, ZBundle, ZObject } from "../types";

interface OrderRow {
  id: string;
  phone_number?: string;
  service_id?: string;
  country_id?: string;
  status?: string;
  price_charged?: number;
  created_at?: string;
  expires_at?: string;
}

interface OrderListResp {
  orders?: OrderRow[];
}

const listRecentOrders = {
  key: "list_recent_orders",
  noun: "Order",
  display: {
    label: "List Recent Orders",
    description:
      "Triggers when a new order is created (used to power the order picker dropdown in other actions).",
    hidden: false,
  },
  operation: {
    type: "polling" as const,
    perform: async (z: ZObject, bundle: ZBundle) => {
      const resp = await z.request<OrderListResp>({
        url: `${apiBase(bundle)}/api/v1/customer/orders`,
        method: "GET",
        params: { limit: 50 },
      });
      resp.throwForStatus();
      return (resp.data.orders ?? []).map((o) => ({
        ...o,
        id: o.id,
        label: `+${o.phone_number ?? ""} (${o.service_id ?? ""}/${o.country_id ?? ""} – ${o.status ?? ""})`,
      }));
    },
    sample: {
      id: "f3c1cf52-ec0b-4908-83ff-58a2217a6633",
      label: "+541127399874 (wa/AR – completed)",
      phone_number: "541127399874",
      service_id: "wa",
      country_id: "AR",
      status: "completed",
      price_charged: 0.8,
      created_at: "2026-05-21T19:21:56Z",
      expires_at: "2026-05-21T19:41:56Z",
    },
  },
};

export default listRecentOrders;

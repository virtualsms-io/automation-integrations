import { apiBase, ZBundle, ZObject } from "../types";

interface OrderRow {
  id: string;
  status: string;
  phone_number?: string;
  service_id?: string;
  country_id?: string;
  expires_at?: string;
}

interface OrderListResp {
  orders?: OrderRow[];
}

const orderExpired = {
  key: "order_expired",
  noun: "Order",
  display: {
    label: "Order Expired",
    description:
      "Polling — fires once per order that newly transitions to status=expired.",
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
      return (resp.data.orders ?? [])
        .filter((o) => o.status === "expired")
        .map((o) => ({ ...o, id: o.id }));
    },
    sample: {
      id: "7e44ebb5-9a55-4bd8-a4e9-7f226f9d5ebd",
      phone_number: "541127399874",
      service_id: "wa",
      country_id: "AR",
      status: "expired",
      expires_at: "2026-05-24T15:40:34Z",
    },
  },
};

export default orderExpired;

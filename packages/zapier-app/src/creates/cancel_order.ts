import { apiBase, ZBundle, ZObject } from "../types";

const cancelOrder = {
  key: "cancel_order",
  noun: "Order",
  display: {
    label: "Cancel Order",
    description:
      "Cancel an order and trigger a refund. Returns HTTP 425 inside the 120-second cooldown after purchase.",
  },
  operation: {
    inputFields: [
      {
        key: "order_id",
        label: "Order ID",
        type: "string",
        required: true,
        dynamic: "list_recent_orders.id.label",
        helpText: "Order UUID returned by **Buy Number**.",
      },
    ],
    perform: async (z: ZObject, bundle: ZBundle) => {
      const id = String(bundle.inputData.order_id);
      const resp = await z.request({
        url: `${apiBase(bundle)}/api/v1/customer/cancel/${encodeURIComponent(id)}`,
        method: "POST",
      });
      resp.throwForStatus();
      return resp.data;
    },
    sample: {
      success: true,
      order_id: "7e44ebb5-9a55-4bd8-a4e9-7f226f9d5ebd",
      status: "cancelled",
      refund_amount: 0.8,
    },
  },
};

export default cancelOrder;

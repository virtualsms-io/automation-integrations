import { apiBase, ZBundle, ZObject } from "../types";

const getOrderStatus = {
  key: "get_order_status",
  noun: "Order Status",
  display: {
    label: "Get Order Status",
    description:
      "Read the current status and any received SMS for an order UUID.",
  },
  operation: {
    inputFields: [
      {
        key: "order_id",
        label: "Order ID",
        type: "string",
        required: true,
        dynamic: "list_recent_orders.id.label",
      },
    ],
    perform: async (z: ZObject, bundle: ZBundle) => {
      const id = String(bundle.inputData.order_id);
      const resp = await z.request({
        url: `${apiBase(bundle)}/api/v1/customer/order/${encodeURIComponent(id)}`,
        method: "GET",
      });
      resp.throwForStatus();
      return [resp.data];
    },
    sample: {
      success: true,
      order_id: "f3c1cf52-ec0b-4908-83ff-58a2217a6633",
      phone_number: "541126335599",
      service: "wa",
      country: "AR",
      price: 0.8,
      status: "completed",
      sms_received: false,
      messages: [
        {
          sender: "",
          content: "Kode WhatsApp Business: 359-241",
          received_at: "2026-05-21T19:21:56Z",
        },
      ],
      created_at: "2026-05-21T19:21:56Z",
      expires_at: "2026-05-21T19:41:56Z",
    },
  },
};

export default getOrderStatus;

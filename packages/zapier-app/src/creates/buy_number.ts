import { apiBase, ZBundle, ZObject } from "../types";

const buyNumber = {
  key: "buy_number",
  noun: "Number",
  display: {
    label: "Buy Number",
    description:
      "Purchase a real-SIM disposable phone number for a service + ISO country code.",
  },
  operation: {
    inputFields: [
      {
        key: "service",
        label: "Service Code",
        type: "string",
        required: true,
        helpText:
          "Short service code (e.g. `wa` for WhatsApp, `tg` for Telegram). Use the **List Services** action to discover codes — they are not slugs.",
      },
      {
        key: "country",
        label: "Country",
        type: "string",
        required: true,
        helpText: "ISO 2-letter country code, e.g. `US`, `GB`, `DE`, `AR`.",
      },
    ],
    perform: async (z: ZObject, bundle: ZBundle) => {
      const resp = await z.request({
        url: `${apiBase(bundle)}/api/v1/customer/purchase`,
        method: "POST",
        body: {
          service: bundle.inputData.service,
          country: bundle.inputData.country,
        },
      });
      resp.throwForStatus();
      return resp.data;
    },
    sample: {
      success: true,
      order_id: "7e44ebb5-9a55-4bd8-a4e9-7f226f9d5ebd",
      phone_number: "541127399874",
      service: "wa",
      country: "AR",
      price: 0.8,
      status: "waiting",
      created_at: "2026-05-24T15:20:34Z",
      expires_at: "2026-05-24T15:40:34Z",
      cancel_available_at: "2026-05-24T15:22:34Z",
      swap_available_at: "2026-05-24T15:22:34Z",
      rules: { cancel_cooldown_seconds: 120, swap_cooldown_seconds: 120 },
    },
  },
};

export default buyNumber;

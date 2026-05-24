import { apiBase, ZBundle, ZObject } from "../types";

interface BalanceResp {
  balance: number;
  success?: boolean;
}

const lowBalance = {
  key: "low_balance",
  noun: "Balance",
  display: {
    label: "Low Balance",
    description:
      "Polling — fires once each time account balance crosses below the configured USD threshold.",
  },
  operation: {
    type: "polling" as const,
    inputFields: [
      {
        key: "threshold",
        label: "Balance Threshold (USD)",
        type: "number",
        required: true,
        default: "5",
        helpText:
          "Trigger fires when balance falls below this value. Debounced — fires once per crossing.",
      },
    ],
    perform: async (z: ZObject, bundle: ZBundle) => {
      const threshold = Number(bundle.inputData.threshold ?? 5);
      const resp = await z.request<BalanceResp>({
        url: `${apiBase(bundle)}/api/v1/customer/balance`,
        method: "GET",
      });
      resp.throwForStatus();
      const balance = Number(resp.data.balance);
      if (!(balance < threshold)) return [];

      const cursor = await z.cursor.get();
      const stateKey = `below-${threshold}`;
      if (cursor === stateKey) return [];
      await z.cursor.set(stateKey);

      return [
        {
          id: `${stateKey}-${Date.now()}`,
          balance,
          threshold,
          currency: "USD",
          crossed_at: new Date().toISOString(),
        },
      ];
    },
    sample: {
      id: "below-5-1716553200000",
      balance: 4.5,
      threshold: 5,
      currency: "USD",
      crossed_at: "2026-05-24T15:34:56Z",
    },
  },
};

export default lowBalance;

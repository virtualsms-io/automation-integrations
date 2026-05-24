import { apiBase, ZBundle, ZObject } from "../types";

const getBalance = {
  key: "get_balance",
  noun: "Balance",
  display: {
    label: "Get Balance",
    description: "Retrieve the current VirtualSMS account balance.",
  },
  operation: {
    inputFields: [],
    perform: async (z: ZObject, bundle: ZBundle) => {
      const resp = await z.request({
        url: `${apiBase(bundle)}/api/v1/customer/balance`,
        method: "GET",
      });
      resp.throwForStatus();
      return [resp.data];
    },
    sample: { balance: 49.39, success: true },
  },
};

export default getBalance;

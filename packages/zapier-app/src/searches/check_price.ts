import { apiBase, ZBundle, ZObject } from "../types";

const checkPrice = {
  key: "check_price",
  noun: "Price",
  display: {
    label: "Check Price",
    description:
      "Look up the current price for a service/country combo. Useful as a pre-flight before Buy Number — returns success: false if combo unavailable.",
  },
  operation: {
    inputFields: [
      { key: "service", label: "Service Code", type: "string", required: true },
      { key: "country", label: "Country", type: "string", required: true },
    ],
    perform: async (z: ZObject, bundle: ZBundle) => {
      const resp = await z.request({
        url: `${apiBase(bundle)}/api/v1/price`,
        method: "GET",
        params: {
          service: bundle.inputData.service,
          country: bundle.inputData.country,
        },
      });
      resp.throwForStatus();
      return [resp.data];
    },
    sample: {
      success: true,
      service: "wa",
      country: "GB",
      service_name: "Whatsapp",
      country_name: "United Kingdom",
      price: 0.9,
      estimated: false,
    },
  },
};

export default checkPrice;

import { apiBase, ZBundle, ZObject } from "../types";

const listCountries = {
  key: "list_countries",
  noun: "Country",
  display: {
    label: "List Countries",
    description:
      "List the VirtualSMS country catalog (ISO codes + names + min prices + supported services).",
  },
  operation: {
    inputFields: [],
    perform: async (z: ZObject, bundle: ZBundle) => {
      const resp = await z.request({
        url: `${apiBase(bundle)}/api/v1/customer/countries`,
        method: "GET",
      });
      resp.throwForStatus();
      const data = resp.data as { countries?: unknown[] };
      return data.countries ?? [];
    },
    sample: {
      country_id: "AR",
      country_name: "Argentina",
      min_price: 0.05,
      services: ["wa", "tg", "fb"],
    },
  },
};

export default listCountries;

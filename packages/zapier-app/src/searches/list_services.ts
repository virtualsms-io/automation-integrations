import { apiBase, ZBundle, ZObject } from "../types";

const listServices = {
  key: "list_services",
  noun: "Service",
  display: {
    label: "List Services",
    description:
      "List the full VirtualSMS service catalog (service codes + names + base prices). Useful as a Find step before Buy Number.",
  },
  operation: {
    inputFields: [],
    perform: async (z: ZObject, bundle: ZBundle) => {
      const resp = await z.request({
        url: `${apiBase(bundle)}/api/v1/customer/services`,
        method: "GET",
      });
      resp.throwForStatus();
      const data = resp.data as { services?: unknown[] };
      return data.services ?? [];
    },
    sample: { service_id: "wa", service_name: "Whatsapp", base_price: 0.8 },
  },
};

export default listServices;

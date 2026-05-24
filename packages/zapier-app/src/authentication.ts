import { apiBase, ZBundle, ZObject } from "./types";

const authentication = {
  type: "custom" as const,
  test: async (z: ZObject, bundle: ZBundle) => {
    const resp = await z.request({
      url: `${apiBase(bundle)}/api/v1/customer/balance`,
      method: "GET",
    });
    resp.throwForStatus();
    return resp.data;
  },
  fields: [
    {
      key: "api_key",
      label: "API Key",
      required: true,
      type: "string",
      helpText:
        "Get your API key at [virtualsms.io](https://virtualsms.io) → Settings → API Keys.",
    },
    {
      key: "base_url",
      label: "Base URL",
      required: false,
      type: "string",
      default: "https://virtualsms.io",
      helpText: "Override only for self-hosted/staging deployments.",
    },
  ],
  connectionLabel: (z: ZObject, bundle: ZBundle) => {
    return `VirtualSMS (${bundle.authData.api_key?.slice(0, 6)}…)`;
  },
};

const includeApiKey = (
  request: { headers?: Record<string, string> },
  z: ZObject,
  bundle: ZBundle,
) => {
  request.headers = request.headers || {};
  if (bundle.authData.api_key) {
    request.headers["X-API-Key"] = bundle.authData.api_key;
  }
  request.headers["Accept"] = "application/json";
  return request;
};

export { authentication, includeApiKey };

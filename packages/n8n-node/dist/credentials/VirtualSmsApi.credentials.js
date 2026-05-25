"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualSmsApi = void 0;
class VirtualSmsApi {
    constructor() {
        this.name = "virtualSmsApi";
        this.displayName = "VirtualSMS API";
        this.documentationUrl = "https://api.virtualsms.io";
        this.properties = [
            {
                displayName: "API Key",
                name: "apiKey",
                type: "string",
                typeOptions: { password: true },
                default: "",
                required: true,
                description: "Your VirtualSMS API key. Find it at https://virtualsms.io → Settings → API Keys.",
            },
            {
                displayName: "Base URL",
                name: "baseUrl",
                type: "string",
                default: "https://virtualsms.io",
                description: "Override only for self-hosted/staging deployments.",
            },
        ];
        this.authenticate = {
            type: "generic",
            properties: {
                headers: {
                    "X-API-Key": "={{$credentials.apiKey}}",
                },
            },
        };
        this.test = {
            request: {
                baseURL: "={{$credentials.baseUrl}}",
                url: "/api/v1/balance",
                method: "GET",
            },
        };
    }
}
exports.VirtualSmsApi = VirtualSmsApi;
//# sourceMappingURL=VirtualSmsApi.credentials.js.map
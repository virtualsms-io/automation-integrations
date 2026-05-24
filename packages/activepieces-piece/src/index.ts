import { createPiece, PieceAuth } from "@activepieces/pieces-framework";

import { buyNumber } from "./lib/actions/buy-number";
import { cancelOrder } from "./lib/actions/cancel-order";
import { checkPrice } from "./lib/actions/check-price";
import { getBalance } from "./lib/actions/get-balance";
import { getOrderStatus } from "./lib/actions/get-order-status";
import { listCountries } from "./lib/actions/list-countries";
import { listServices } from "./lib/actions/list-services";

import { lowBalance } from "./lib/triggers/low-balance";
import { orderExpired } from "./lib/triggers/order-expired";
import { orderReceivedSms } from "./lib/triggers/order-received-sms";

import { virtualSmsAuth } from "./lib/common";

export const virtualsms = createPiece({
  displayName: "VirtualSMS",
  description:
    "Real-SIM SMS verification across 145+ countries and 2,500+ services. Buy disposable phone numbers and receive OTP codes via polling triggers.",
  auth: virtualSmsAuth,
  minimumSupportedRelease: "0.20.0",
  logoUrl: "https://virtualsms.io/branding/icon-256.png",
  authors: ["virtualsms-io"],
  categories: ["COMMUNICATION", "DEVELOPER_TOOLS"] as never,
  actions: [
    buyNumber,
    getOrderStatus,
    cancelOrder,
    listServices,
    listCountries,
    checkPrice,
    getBalance,
  ],
  triggers: [orderReceivedSms, orderExpired, lowBalance],
});

export { PieceAuth };

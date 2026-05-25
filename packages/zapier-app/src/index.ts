import { authentication, includeApiKey } from "./authentication";

import buyNumber from "./creates/buy_number";
import cancelOrder from "./creates/cancel_order";

import getOrderStatus from "./searches/get_order_status";
import listServices from "./searches/list_services";
import listCountries from "./searches/list_countries";
import checkPrice from "./searches/check_price";
import getBalance from "./searches/get_balance";

import orderReceivedSms from "./triggers/order_received_sms";
import orderExpired from "./triggers/order_expired";
import lowBalance from "./triggers/low_balance";
import listRecentOrders from "./triggers/list_recent_orders";

const pkg = require("../package.json") as { version: string };

// Keep this in sync with dependencies.zapier-platform-core in package.json.
// Zapier requires an EXACT pin in deps and reads this constant at runtime
// to verify the package was tested against the version the CLI uploads.
const PLATFORM_VERSION = "19.0.0";

const App = {
  version: pkg.version,
  platformVersion: PLATFORM_VERSION,
  // Disable Zapier's auto input-data cleaning globally — our handlers
  // receive raw values from the user and forward them as-is so output
  // is predictable across triggers / actions / searches (D028 advisory).
  flags: { cleanInputData: false },
  authentication,
  beforeRequest: [includeApiKey],
  afterResponse: [],
  triggers: {
    [orderReceivedSms.key]: orderReceivedSms,
    [orderExpired.key]: orderExpired,
    [lowBalance.key]: lowBalance,
    [listRecentOrders.key]: listRecentOrders,
  },
  searches: {
    [getOrderStatus.key]: getOrderStatus,
    [listServices.key]: listServices,
    [listCountries.key]: listCountries,
    [checkPrice.key]: checkPrice,
    [getBalance.key]: getBalance,
  },
  creates: {
    [buyNumber.key]: buyNumber,
    [cancelOrder.key]: cancelOrder,
  },
};

module.exports = App;
export default App;

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

const pkg = require("../package.json") as { version: string };

const App = {
  version: pkg.version,
  platformVersion: require("zapier-platform-core/package.json").version,
  authentication,
  beforeRequest: [includeApiKey],
  afterResponse: [],
  triggers: {
    [orderReceivedSms.key]: orderReceivedSms,
    [orderExpired.key]: orderExpired,
    [lowBalance.key]: lowBalance,
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

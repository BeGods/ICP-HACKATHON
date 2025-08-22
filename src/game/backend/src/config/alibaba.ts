import config from "./config";

const Core = require("@alicloud/pop-core");

export const client = new Core({
  accessKeyId: config.alibaba.accessKeyId,
  accessKeySecret: config.alibaba.accessKeySecret,
  endpoint: config.alibaba.endpoint,
  apiVersion: "2018-05-01",
});

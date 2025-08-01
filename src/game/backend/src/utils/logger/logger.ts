import { UAParser } from "ua-parser-js";

export function getRealClientIP(req: any): string {
  const cfIP = req.headers["cf-connecting-ip"];
  if (cfIP) return cfIP.trim();

  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();

  return req.ip?.startsWith("::ffff:") ? req.ip.replace("::ffff:", "") : req.ip;
}

export function normalizeUserAgent(uaString: string = ""): string {
  const parser = new UAParser(uaString);
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown";
  const os = result.os.name || "Unknown";
  const device = result.device.type || "desktop";

  if (/Telegram/i.test(uaString)) return "telegram-browser";
  if (/Line/i.test(uaString)) return "line-browser";
  if (/FB_IAB|FBAN/i.test(uaString)) return "facebook-browser";
  if (/Instagram/i.test(uaString)) return "instagram-browser";

  if (device === "mobile" || device === "tablet") {
    if (/Android/i.test(os)) return "android-browser";
    if (/iOS|Mac OS/i.test(os)) return "ios-browser";
    return `${os.toLowerCase()}-browser`;
  }

  if (browser !== "Unknown") return browser.toLowerCase();

  return uaString || "unknown-ua";
}

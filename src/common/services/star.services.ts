import axios from "axios";
import config from "../../config/config";

const invoiceDetails = {
  automata: {
    title: "Automata Pack",
    description: "Claim Automata pack all at once for all mythologies.",
    currency: "XTR",
    amount: 1,
  },
  burst: {
    title: "Burst Pack",
    description: "Claim Burst pack all at once for all mythologies.",
    currency: "XTR",
    amount: 3,
  },
};

export const createInvoice = async (rewardType, uuid) => {
  const { title, description, currency, amount, payload } =
    invoiceDetails[rewardType];
  const totalAmount = amount;

  const data = {
    title,
    description,
    payload,
    provider_token: "",
    currency,
    prices: [{ label: title, amount: totalAmount }],
  };

  if (uuid) {
    data["payload"] = uuid;
  }

  try {
    const TELEGRAM_BOT_TOKEN = config.security.TMA_BOT_TOKEN;

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/createInvoiceLink`,
      data
    );
    return response.data.result;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw new Error("Failed to create invoice");
  }
};

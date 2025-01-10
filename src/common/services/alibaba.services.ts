import { client } from "../../config/alibaba";

export const callAlibabaSendMsg = async (params) => {
  try {
    client
      .request("SendMessageToGlobe", params, {
        method: "POST",
      })
      .then((result) => {
        console.log("SMS sent successfully:", result);
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
      });
  } catch (error) {
    throw new Error(error);
  }
};

import config from "../config/config";
import axios from "axios";

// playsuper
export const getPlaysuperOtp = async (mobileNumber) => {
  try {
    await axios.post(
      `${config.playsuper.PS_API_URL}/player/request-otp`,
      { phone: `${mobileNumber}` },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
        },
      }
    );
  } catch (error) {
    console.error("Error message:", error.message);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    throw new Error("Error in fetching OTP from playsuper");
  }
};

export const resendPlaysuperOtp = async (mobileNumber) => {
  try {
    const result = await axios.post(
      `${config.playsuper.PS_API_URL}/player/resend-otp`,
      { phone: mobileNumber },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
        },
      }
    );

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error in fetching otp from playsuper");
  }
};

export const verifyPlaysuperOtp = async (mobileNumber, otp) => {
  try {
    const result = await axios.post(
      `${config.playsuper.PS_API_URL}/player/login`,
      { phone: `${mobileNumber}`, otp: otp },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
        },
      }
    );

    return result;
  } catch (error) {
    console.log(error);

    throw new Error("Error in verifying otp from playsuper");
  }
};

export const fetchPlaySuperRewards = async (
  country: string,
  lang: string,
  playsuperCred: { isVerified: boolean; key: string }
) => {
  try {
    const headers: { [key: string]: string } = {
      accept: "application/json",
      "x-language": lang,
      "x-api-key": `${config.playsuper.PS_API_KEY}`,
    };

    if (playsuperCred?.isVerified && playsuperCred) {
      headers.Authorization = `Bearer ${playsuperCred.key}`;
    }
    let url = `${config.playsuper.PS_API_URL}/rewards`;

    const params = {
      coinId: `${config.playsuper.PS_COIN_ID}`,
      ...(country && { country }),
    };

    const result = await axios.get(url, {
      params: params,
      headers: headers,
    });

    const rewards = result.data.data.data.map(
      ({ price, availableQuantity, organizationId, brandId, type, ...rest }) =>
        rest
    );

    return rewards;
  } catch (error) {
    console.log(error);
    throw new Error("Error in fetching rewards from playsuper");
  }
};

export const fetchPlaysuperOrders = async (lang, playsuperToken) => {
  try {
    if (!playsuperToken) {
      return [];
    }
    const headers: { [key: string]: string } = {
      accept: "application/json",
      "x-language": lang,
      "x-api-key": `${config.playsuper.PS_API_KEY}`,
      Authorization: `Bearer ${playsuperToken}`,
    };

    const result = await axios.get(
      `${config.playsuper.PS_API_URL}/player/orders`,
      {
        params: {
          limit: 25,
        },
        headers: headers,
      }
    );

    return result.data.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error in fetching rewards from playsuper");
  }
};

const purchaseReward = async (rewardId, authToken) => {
  try {
    const response = await axios.post(
      `${config.playsuper.PS_API_URL}/rewards/purchase`,
      {
        rewardId: rewardId,
        coinId: `${config.playsuper.PS_COIN_ID}`,
        isPrefillEnabled: true,
      },
      {
        headers: {
          accept: "application/json",
          "x-api-key": `${config.playsuper.PS_API_KEY}`,
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("purchase err", error);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const claimPlaysuperReward = async (rewardId, authToken) => {
  try {
    const purchaseResponse = await purchaseReward(rewardId, authToken);

    return purchaseResponse;
  } catch (error) {
    console.error("Error in one of the requests:", error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const checkPlaysuperExpiry = async (playsuperData) => {
  try {
    const createdDate = new Date(playsuperData.createdAt).getTime();
    const currentDate = new Date().getTime();
    const diffInMs = currentDate - createdDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays > 28;
  } catch (error) {
    console.error("Error", error.message);
    return false;
  }
};

// const distributeCoins = async (authToken) => {
//     try {
//       const response = await axios.post(
//         `${config.playsuper.PS_API_URL}/coins/${config.playsuper.PS_COIN_ID}/distribute`,
//         {
//           amount: 100,
//         },
//         {
//           headers: {
//             accept: "*/*",
//             "x-api-key": `${config.playsuper.PS_API_KEY}`,
//             Authorization: `Bearer ${authToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return response;
//     } catch (error) {
//       console.log("Distribute err", error);

//       throw new Error(error.response ? error.response.data : error.message);
//     }
//   };

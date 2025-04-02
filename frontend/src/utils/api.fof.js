import axios from "axios";
import CryptoJS from "crypto-js";


export const authenticateTg = async (userData, referralCode) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/tele/auth`;
  if (referralCode) {
    url += `?referralCode=${referralCode}`;
  }

  try {
    const response = await axios.post(url, userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const authenticateOneWave = async (param) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/onewave/auth`;


  try {
    const response = await axios.post(url, { sessionId: param }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const authenticateLineWallet = async (message, signature) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/wallet/auth`;

  try {
    const response = await axios.post(url, { message: message, signature: signature }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};


export const authenticateLine = async (token, code) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/line/auth`;


  try {
    const response = await axios.post(url, { token: token, code: code }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const refreshAuthToken = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_FOF_URL}/auth/refresh`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};



export const fetchGameStats = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/game/stats`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchProfilePhoto = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/profile/avatar`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const updateMythology = async (mythology, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL
    }/game/stats/update?mythologyName=${mythology}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchLeaderboard = async (accessToken, userRank, pageNum) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/leaderboard`;

  url += `?userRank=${userRank}`;
  if (pageNum != 0) {
    url += `&page=${pageNum}`;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const convertOrbs = async (data, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/game/convert`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimMoonBoost = async (accessToken, adId) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/booster/claim/moon`;
  const secretKey = import.meta.env.VITE_HASH_KEY;
  const gameData = {
    adId: adId,
  };
  const hashedData = CryptoJS.AES.encrypt(
    JSON.stringify(gameData),
    secretKey
  ).toString();

  try {
    const response = await axios.post(
      url,
      { data: hashedData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimShareReward = async (questData, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/quests/share`;

  try {
    const response = await axios.post(url, questData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimQuestOrbsReward = async (questData, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/quests/claim/share`;

  try {
    const response = await axios.post(url, questData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimQuest = async (questData, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/quests/claim`;

  try {
    const response = await axios.post(url, questData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const completeQuest = async (questData, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/quests/complete`;

  try {
    const response = await axios.post(url, questData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimShardsBooster = async (mythologyName, adId, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/booster/claim/minion`;
  const secretKey = import.meta.env.VITE_HASH_KEY;
  const gameData = {
    mythologyName: mythologyName.mythologyName,
    adId: adId,
  };
  const hashedData = CryptoJS.AES.encrypt(
    JSON.stringify(gameData),
    secretKey
  ).toString();

  try {
    const response = await axios.post(
      url,
      { data: hashedData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimBurstBooster = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/booster/claim/burst`;

  try {
    const response = await axios.post(url, mythologyName, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimAutomataBooster = async (
  mythologyName,
  adId,
  accessToken
) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/booster/claim/automata`;
  const secretKey = import.meta.env.VITE_HASH_KEY;
  const gameData = {
    mythologyName: mythologyName.mythologyName,
    adId: adId,
  };

  const hashedData = CryptoJS.AES.encrypt(
    JSON.stringify(gameData),
    secretKey
  ).toString();

  try {
    const response = await axios.post(
      url,
      { data: hashedData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimAutoAutomata = async (accessToken, adId) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/booster/autoClaim/automata`;
  const gameData = {
    adId: adId,
  };
  const secretKey = import.meta.env.VITE_HASH_KEY;
  const hashedData = CryptoJS.AES.encrypt(
    JSON.stringify(gameData),
    secretKey
  ).toString();

  try {
    const response = await axios.post(
      url,
      { data: hashedData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimAutoBurst = async (accessToken, adId) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/booster/autoClaim/burst`;
  const gameData = {
    adId: adId,
  };
  const secretKey = import.meta.env.VITE_HASH_KEY;
  const hashedData = CryptoJS.AES.encrypt(
    JSON.stringify(gameData),
    secretKey
  ).toString();

  try {
    const response = await axios.post(
      url,
      { data: hashedData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const connectTonWallet = async (tonAddress, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/user/connectTon`;

  try {
    const response = await axios.post(url, tonAddress, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const disconnectTonWallet = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/user/disconnectTon`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const connectLineWallet = async (kaiaAddress, signature, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/connect/line`;

  try {
    const response = await axios.post(url, { message: kaiaAddress, signature: signature }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const disconnectLineWallet = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/disconnect/line`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const startTapSession = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/game/startTapSession`;

  try {
    const response = await axios.post(url, mythologyName, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimBurst = async (result, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/game/burst`;

  try {
    const response = await axios.post(url, result, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const updateGameData = async (gameData, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/game/claimTapSession`;
  const secretKey = import.meta.env.VITE_HASH_KEY;
  const hashedData = CryptoJS.AES.encrypt(
    JSON.stringify(gameData),
    secretKey
  ).toString();
  try {
    const response = await axios.post(
      url,
      { data: hashedData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchLostQuests = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL
    }/quests/lost?mythologyName=${mythologyName}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimLostQuest = async (questData, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/quests/claim/lost`;

  try {
    const response = await axios.post(url, questData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchBonusStatus = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/bonus/status`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchDailyBonus = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/bonus/daily`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchExploitDailyBonus = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/bonus/dail`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchJoiningBonus = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/bonus/join`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimSocialTask = async (data, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/quests/social`;

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchRewards = async (
  lang = null,
  country = "NA",
  accessToken
) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/partners`;

  let queryParams = [];

  // if (country !== "NA") {
  //   queryParams.push(`country=${country}`);
  // }

  if (lang) {
    queryParams.push(`lang=${lang}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchOTP = async (mobileNumber, name) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/auth/otp`;

  try {
    const response = await axios.post(
      url,
      { mobileNumber: mobileNumber, username: name }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const verifyOtp = async (mobileNumber, name, otp, refer) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/auth/verify`;

  console.log(refer);

  try {
    const response = await axios.post(
      url,
      {
        mobileNumber: mobileNumber,
        username: name,
        otp: otp,
        refer: refer
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchResendOTP = async (mobileNumber, otp, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/playsuper/resendOtp`;

  try {
    const response = await axios.get(
      url,
      {
        mobileNumber: mobileNumber,
        otp: otp,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimPlaysuperReward = async (rewardId, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/playsuper/redeem`;

  try {
    const response = await axios.post(
      url,
      {
        rewardId: rewardId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimCustomReward = async (rewardId, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/custom/redeem`;

  try {
    const response = await axios.post(
      url,
      {
        partnerId: rewardId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimStreakBonus = async (accessToken, country) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/bonus/streak`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const updateCountry = async (country, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/user/country`;

  try {
    const response = await axios.post(
      url,
      {
        country: country,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimAnmntReward = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/reward/claim`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const addLeaderboardBet = async (accessToken, status) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/leaderboard/bet`;

  try {
    const response = await axios.post(
      url,
      { status: status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const updateRewardStatus = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/update/reward`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const claimRatUpdate = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/game/rat`;

  try {
    const response = await axios.post(url, mythologyName, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const generateStarInvoice = async (accessToken, type) => {
  let url = `${import.meta.env.VITE_API_FOF_URL}/stars/invoice`;
  if (type) {
    url += `?type=${type}`;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const updateFinishStatus = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/user/finish`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const sendTestTGA = async () => {
  let url = `https://tganalytics.xyz/events`;

  try {
    const response = await axios.post(url, {
      "app_name": "TanmTest_2020",
      "user_id": 1126065333,
      "event_name": "hello",
      "session_id": "d0f6880a-66cd-452f-befc-03e73e7cbd8e"
    }, {
      headers: {
        "TGA-Auth-Token": `eyJhcHBfbmFtZSI6IlRhbm1UZXN0XzIwMjAiLCJhcHBfdXJsIjoiaHR0cHM6Ly90Lm1lL2JlR29kc190ZXN0X2JvdCIsImFwcF9kb21haW4iOiJodHRwczovL3QubWUvYmVHb2RzX3Rlc3RfYm90L3Rlc3QifQ==!fzR/j2CnLMkPM3JvKcDlcqIDwf+DE+u2fCdo2MUdcWI=`,
        "Content-Type": "application/json"
      },
    });


    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const getPaymentId = async (accessToken, booster, paymentMethod) => {
  let url = `${import.meta.env.VITE_API_URL}/line/createPayment?booster=${booster}&paymentMethod=${paymentMethod}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.payment_id;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};
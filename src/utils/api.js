import axios from "axios";
import CryptoJS from "crypto-js";

export const authenticate = async (userData, referralCode) => {
  let url = `${import.meta.env.VITE_API_URL}/auth`;
  if (referralCode) {
    url += `?referralCode=${referralCode}`;
  }

  try {
    const response = await axios.post(url, userData);
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export const fetchGameStats = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/game/stats`;

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
  let url = `${import.meta.env.VITE_API_URL}/profile/avatar`;

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
  let url = `${
    import.meta.env.VITE_API_URL
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

export const fetchLeaderboard = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/leaderboard`;

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
  let url = `${import.meta.env.VITE_API_URL}/game/convert`;

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

export const claimShareReward = async (questData, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/quests/share`;

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
  let url = `${import.meta.env.VITE_API_URL}/quests/claim/share`;

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
  let url = `${import.meta.env.VITE_API_URL}/quests/claim`;

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
  let url = `${import.meta.env.VITE_API_URL}/quests/complete`;

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

export const claimShardsBooster = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/booster/claim/minion`;

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

export const claimBurstBooster = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/booster/claim/burst`;

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

export const claimAutomataBooster = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/booster/claim/automata`;

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

export const claimAutoAutomata = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/booster/autoClaim/automata`;

  try {
    const response = await axios.post(
      url,
      {},
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
  let url = `${import.meta.env.VITE_API_URL}/user/connectTon`;

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
  let url = `${import.meta.env.VITE_API_URL}/user/disconnectTon`;

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
  let url = `${import.meta.env.VITE_API_URL}/game/startTapSession`;

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
  let url = `${import.meta.env.VITE_API_URL}/game/burst`;

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
  let url = `${import.meta.env.VITE_API_URL}/game/claimTapSession`;
  const secretKey = "K/;|&t%(pX)%2@k|?1t^#GY;!w7:(PY<";
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
  let url = `${
    import.meta.env.VITE_API_URL
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
  let url = `${import.meta.env.VITE_API_URL}/quests/claim/lost`;

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
  let url = `${import.meta.env.VITE_API_URL}/bonus/status`;

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
  let url = `${import.meta.env.VITE_API_URL}/bonus/daily`;

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
  let url = `${import.meta.env.VITE_API_URL}/bonus/dail`;

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
  let url = `${import.meta.env.VITE_API_URL}/bonus/join`;

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
  let url = `${import.meta.env.VITE_API_URL}/quests/social`;

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
  let url = `${import.meta.env.VITE_API_URL}/partners`;

  let queryParams = [];

  if (country !== "NA") {
    queryParams.push(`country=${country}`);
  }

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

export const fetchOTP = async (mobileNumber, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/playsuper/otp`;

  try {
    const response = await axios.post(
      url,
      { mobileNumber: mobileNumber },
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

export const verifyOtp = async (mobileNumber, otp, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/playsuper/verify`;

  try {
    const response = await axios.post(
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

export const fetchResendOTP = async (mobileNumber, otp, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/playsuper/resendOtp`;

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
  let url = `${import.meta.env.VITE_API_URL}/playsuper/redeem`;

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

import axios from "axios";

export const authenticate = async (userData) => {
  let url = `${import.meta.env.VITE_API_URL}/auth`;

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

export const convertOrbs = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/game/convertOrbs`;

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

export const claimShardsBooster = async (mythologyName, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/booster/claimShards`;

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
  let url = `${import.meta.env.VITE_API_URL}/booster/claimAutomata`;

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

export const updateGameData = async (gameData, accessToken) => {
  let url = `${import.meta.env.VITE_API_URL}/game/claimTapSession`;

  try {
    const response = await axios.post(url, gameData, {
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
  let url = `${import.meta.env.VITE_API_URL}/quests/claimLostQuest`;

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

import axios from "axios";

export const fetchGameStats = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/game/stats`;

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

export const startSession = async (accessToken, isInside) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/game/startSession`;

  if (isInside) {
    url += `?isInside=true`
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

export const claimSessionReward = async (accessToken, battleData) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/game/claimSession`;


  try {
    const response = await axios.post(url, battleData, {
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

export const updateVaultData = async (accessToken, arrayOfIds) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/transfer/toVault`;

  try {
    const response = await axios.post(
      url,
      { itemIds: arrayOfIds },
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

export const updateBagData = async (accessToken, arrayOfIds) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/transfer/toBag`;

  try {
    const response = await axios.post(
      url,
      { itemIds: arrayOfIds },
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

export const fetchJoiningBonus = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/bonus/join`;

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
  let url = `${import.meta.env.VITE_API_ROR_URL}/bonus/daily`;

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

export const activateBlacksmith = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/blacksmith/activate`;

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

export const activateLibrarian = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/librarian/activate`;

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


export const activateVault = async (accessToken, isMulti) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/vault/activate`;

  if (isMulti) {
    url += `?isMulti=${isMulti}`
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

export const activateRest = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/rest/activate`;

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

export const completeItem = async (accessToken, itemId) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/blacksmith/claim`;

  try {
    const response = await axios.post(
      url,
      { itemId: itemId },
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

export const joinItem = async (accessToken, arrayOfIds, payMethod) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/blacksmith/join`;

  try {
    const response = await axios.post(
      url,
      { itemIds: arrayOfIds, payMethod: payMethod },
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

export const tradeItem = async (accessToken, itemId) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/merchant/trade`;

  try {
    const response = await axios.post(
      url,
      { itemId: itemId },
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


export const claimItemAbility = async (accessToken, itemId) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/game/claim`;

  try {
    const response = await axios.post(url, { itemId: itemId }, {
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

export const claimArtifact = async (accessToken, itemId) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/artifact/claim`;

  try {
    const response = await axios.post(url, { itemId: itemId }, {
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


export const claimPotion = async (accessToken, type) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/trade/potion`;

  try {
    const response = await axios.post(
      url,
      { type: type },
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
}

export const fetchLeaderboard = async (accessToken, userRank, pageNum) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/leaderboard`;

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
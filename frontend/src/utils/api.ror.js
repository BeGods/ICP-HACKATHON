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

export const startSession = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/game/startSession`;

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

  console.log(battleData);

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

export const activateVault = async (accessToken) => {
  let url = `${import.meta.env.VITE_API_ROR_URL}/vault/activate`;

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

export const completeItem = async (accessToken, arrayOfIds, payMethod) => {
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

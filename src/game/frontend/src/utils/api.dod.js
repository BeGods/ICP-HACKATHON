import axios from "axios";

export const fetchGameStats = async (accessToken) => {
    let url = `${import.meta.env.VITE_API_DOD_URL}/game/stats`;

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

export const startTurn = async (accessToken) => {
    let url = `${import.meta.env.VITE_API_DOD_URL}/turns/start`;

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

export const updateCardDeck = async (accessToken, arrayOfIds) => {
    let url = `${import.meta.env.VITE_API_DOD_URL}/game/deck`;

    try {
        const response = await axios.post(
            url,
            { godsArr: arrayOfIds },
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

export const updateBattleResult = async (accessToken, cardId) => {
    let url = `${import.meta.env.VITE_API_DOD_URL}/battle/resolve`;

    try {
        const response = await axios.post(url, { cardId: cardId }, {
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

export const updateGodStatus = async (accessToken, charId) => {
    let url = `${import.meta.env.VITE_API_DOD_URL}/equip/god`;

    try {
        const response = await axios.post(url, { charId: charId, payMethod: 0 }, {
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

export const updateWeaponStatus = async (accessToken, charId, relicId) => {
    let url = `${import.meta.env.VITE_API_DOD_URL}/equip/relic`;

    try {
        const response = await axios.post(url, { charId: charId, relicId: relicId, payMethod: 0 }, {
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

export const fetchExplore = async (accessToken) => {
    let url = `${import.meta.env.VITE_API_DOD_URL}/battle/explore`;

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

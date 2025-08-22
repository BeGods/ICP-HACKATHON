import { create } from "zustand";
import { devtools } from "zustand/middleware";
import assets from "../assets/assets.json";

const setWithPrev = (set, key) => (update) =>
    set((state) => ({
        [key]: typeof update === "function" ? update(state[key]) : update,
    }));

// Global slice
const createGlobalSlice = (set) => ({
    isBrowser: false,
    recentToasts: [],
    section: 1,
    minimize: 0,
    activeMyth: 0,
    game: "fof",
    tokens: null,
    payouts: [],
    lineWallet: null,
    showCard: null,
    globalRewards: [],
    triggerConf: false,
    activeReward: null,
    enableHaptic: true,
    isTelegram: false,
    isTgDesktop: false,
    isTgMobile: false,
    enableSound: true,
    userData: null,
    platform: null,
    authToken: null,
    country: "NA",
    lang: null,
    tasks: [],
    assets: assets,

    setIsBrowser: setWithPrev(set, "isBrowser"),
    setRecentToasts: setWithPrev(set, "recentToasts"),
    setSection: setWithPrev(set, "section"),
    setMinimize: setWithPrev(set, "minimize"),
    setActiveMyth: setWithPrev(set, "activeMyth"),
    setGame: setWithPrev(set, "game"),
    setTokens: setWithPrev(set, "tokens"),
    setPayouts: setWithPrev(set, "payouts"),
    setLineWallet: setWithPrev(set, "lineWallet"),
    setShowCard: setWithPrev(set, "showCard"),
    setGlobalRewards: setWithPrev(set, "globalRewards"),
    setTriggerConf: setWithPrev(set, "triggerConf"),
    setActiveReward: setWithPrev(set, "activeReward"),
    setEnableHaptic: setWithPrev(set, "enableHaptic"),
    setIsTelegram: setWithPrev(set, "isTelegram"),
    setIsTgDesktop: setWithPrev(set, "isTgDesktop"),
    setIsTgMobile: setWithPrev(set, "isTgMobile"),
    setEnableSound: setWithPrev(set, "enableSound"),
    setUserData: setWithPrev(set, "userData"),
    setPlatform: setWithPrev(set, "platform"),
    setAuthToken: setWithPrev(set, "authToken"),
    setCountry: setWithPrev(set, "country"),
    setLang: setWithPrev(set, "lang"),
    setTasks: setWithPrev(set, "tasks"),
});

// FoF slice
const createFoFSlice = (set) => ({
    gameData: null,
    questsData: null,
    keysData: null,
    rewardsClaimedInLastHr: null,
    showBooster: null,

    setGameData: setWithPrev(set, "gameData"),
    setQuestsData: setWithPrev(set, "questsData"),
    setKeysData: setWithPrev(set, "keysData"),
    setShowBooster: setWithPrev(set, "showBooster"),
    setRewardsClaimedInLastHr: setWithPrev(set, "rewardsClaimedInLastHr"),
});

// RoR slice
const createRoRSlice = (set) => ({
    mythBg: null,
    rewards: [],
    swipes: 0,
    shiftBg: 50,
    isSwiping: false,
    shardReward: null,
    rewardsClaimedInLastHr: null,
    battleData: {
        currentRound: 1,
        roundData: [],
    },

    setMythBg: setWithPrev(set, "mythBg"),
    setRewards: setWithPrev(set, "rewards"),
    setSwipes: setWithPrev(set, "swipes"),
    setShiftBg: setWithPrev(set, "shiftBg"),
    setIsSwiping: setWithPrev(set, "isSwiping"),
    setShardReward: setWithPrev(set, "shardReward"),
    setRewardsClaimedInLastHr: setWithPrev(set, "rewardsClaimedInLastHr"),
    setBattleData: setWithPrev(set, "battleData"),
});

// RoR slice
const createDoDSlice = (set) => ({
    gameStats: null,
    showEffect: false,
    setGameStats: setWithPrev(set, "gameStats"),
    setShowEffect: setWithPrev(set, "showEffect"),
});

// Store
export const useStore = create(
    devtools((set) => ({
        ...createGlobalSlice(set),
        ...createFoFSlice(set),
        ...createRoRSlice(set),
        ...createDoDSlice(set)
    }))
);


// setGameData: (gameData) => set({ gameData }),

// gameData: {
//     stats: null,
//     bag: null,
//     bank: null,
//     pouch: null,
//     claimedItems: null,
//     builder: null,
// },

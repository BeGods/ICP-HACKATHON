// mythology order
export const mythOrder = ["Greek", "Celtic", "Norse", "Egyptian"];
export const myths = ["greek", "celtic", "norse", "egyptian"];
export const elements = ["fire", "earth", "water", "air"];
export const mythElementNames = {
  fire: "Greek",
  earth: "Celtic",
  water: "Norse",
  air: "Egyptian",
  aether: "Aether",
};
export const elemMythNames = {
  greek: "fire",
  celtic: "earth",
  norse: "water",
  egyptian: "air",
  aether: "aether",
};
export const locations = [
  "celtic.earth01",
  "celtic.earth02",
  "egyptian.air01",
  "egyptian.air02",
  "greek.fire01",
  "greek.fire02",
  "norse.water01",
  "norse.water02",
];

export const validCountries = ["IND"];
export const underworldItemsList = [
  "relic.C01",
  "relic.C02",
  "relic.C03",
  "relic.C04",
  "relic.C05",
  "relic.C09",
  "artifact.treasure01",
];

// default mythologies
export const defaultMythologies = [
  {
    name: "Celtic",
    orbs: 0,
    shards: 0,
    tapSessionStartTime: 0,
    lastTapAcitivityTime: Date.now(),
    energy: 1000,
    energyLimit: 1000,
    faith: 0,
    boosters: {
      shardslvl: 1,
      shardsLastClaimedAt: 0,
      isShardsClaimActive: true,
      automataLastClaimedAt: 0,
      isAutomataActive: false,
      automataStartTime: 0,
      rats: {
        count: 0,
        lastClaimedThreshold: 0,
      },
    },
  },
  {
    name: "Egyptian",
    orbs: 0,
    shards: 0,
    tapSessionStartTime: 0,
    lastTapAcitivityTime: Date.now(),
    energy: 1000,
    energyLimit: 1000,
    faith: 0,
    boosters: {
      shardslvl: 1,
      shardsLastClaimedAt: 0,
      isShardsClaimActive: true,
      automataLastClaimedAt: 0,
      isAutomataActive: false,
      automataStartTime: 0,
      rats: {
        count: 0,
        lastClaimedThreshold: 0,
      },
    },
  },
  {
    name: "Greek",
    orbs: 0,
    shards: 0,
    tapSessionStartTime: 0,
    lastTapAcitivityTime: Date.now(),
    energy: 1000,
    energyLimit: 1000,
    faith: 0,
    boosters: {
      shardslvl: 1,
      shardsLastClaimedAt: 0,
      isShardsClaimActive: true,
      automataLastClaimedAt: 0,
      isAutomataActive: false,
      automataStartTime: 0,
      rats: {
        count: 0,
        lastClaimedThreshold: 0,
      },
    },
  },
  {
    name: "Norse",
    orbs: 0,
    shards: 0,
    tapSessionStartTime: 0,
    lastTapAcitivityTime: Date.now(),
    energy: 1000,
    energyLimit: 1000,
    faith: 0,
    boosters: {
      shardslvl: 1,
      shardsLastClaimedAt: 0,
      isShardsClaimActive: true,
      automataLastClaimedAt: 0,
      isAutomataActive: false,
      automataStartTime: 0,
      rats: {
        count: 0,
        lastClaimedThreshold: 0,
      },
    },
  },
];

export const defaultVault = [
  {
    name: "celtic",
    items: [],
  },
  {
    name: "egyptian",
    items: [],
  },
  {
    name: "greek",
    items: [],
  },
  {
    name: "norse",
    items: [],
  },
];

export const mythElementNamesLowerCase = {
  fire: "greek",
  earth: "celtic",
  water: "norse",
  air: "egyptian",
  aether: "aether",
};

//   A   B   C
//  Bronze:  2.0x = 03  05  07
//           2.1x = 12  15  18
//           2.2x = 24  28  32
//  Silver:  3.1x = 39  41  43
//           3.2x = 48  51  54
//           3.3x = 60  64  68
//  Gold:    4.1x = 75  77  79
//           4.2x = 84  87  90
//           4.3x = 96  100 104

export const determineStreak = (day) => {
  const streakData = [
    {
      level: "Bronze",
      ranges: [
        [3, 5, 7, 2.0],  // star superstar champion
        [12, 15, 18, 2.1],  // icon hallOfFame invincible
        [24, 28, 32, 2.2],  // legend golden supreme
      ],
    },
    {
      level: "Silver",
      ranges: [
        [39, 41, 43, 3.1], // star superstar champion
        [48, 51, 54, 3.2],  // icon hallOfFame invincible
        [60, 64, 68, 3.3], // legend golden supreme
      ],
    },
    {
      level: "Gold",
      ranges: [
        [75, 77, 79, 4.1],  // star superstar champion
        [84, 87, 90, 4.2],  // icon hallOfFame invincible
        [96, 100, 104, 4.3],  // legend golden supreme
      ],
    },
  ];

  for (const { level, ranges } of streakData) {
    for (let i = 0; i < ranges.length; i++) {
      const [a, b, c, multiplier] = ranges[i];

      if (day === a)
        return {
          level: level,
          multiplier,
          reward: "alchemist",
        };
      if (day === b)
        return {
          level: level,
          multiplier,
          reward: "automata",
        };
      if (day === c)
        return {
          level: level,
          multiplier,
          reward: "burst",
        };
    }
  }

  return null; // no reward for this day
};

export const getStreakMultipier = (booster = "blah", streakCount, isSameMyth) => {
  if (!booster) {
    return 1
  }

  const streakReward = determineStreak(streakCount);

  if (!streakReward) {
    return 1;
  }

  if (streakReward.reward !== booster) {
    return 1;
  }

  if (!isSameMyth) {
    return 1;
  }

  return streakReward.multiplier;
};


export const determineStreakBadge = (num) => {
  const levels = [
    {
      level: "Bronze",
      ranges: [
        [3, 5, 7, "star"],
        [12, 15, 18, "superstar"],
        [24, 28, 32, "champion"],
      ],
    },
    {
      level: "Silver",
      ranges: [
        [39, 41, 43, "icon"],
        [48, 51, 54, "hallOfFame"],
        [60, 64, 68, "invincible"],
      ],
    },
    {
      level: "Gold",
      ranges: [
        [75, 77, 79, "legend"],
        [84, 87, 90, "golden"],
        [96, 100, 104, "supreme"],
      ],
    },
  ];


  for (const level of levels) {
    for (const range of level.ranges) {
      if (range.slice(0, 3).includes(num)) {
        return range[3];
      }
    }
  }
  return null;

}
//   A   B   C
//  Bronze:  2.0x = 03  05  07
//           2.5x = 12  15  18
//           3.0x = 24  28  32
//  Silver:  3.5x = 39  41  43
//           4.0x = 48  51  54
//           4.5x = 60  64  68
//  Gold:    5.0x = 75  77  79
//           5.5x = 84  87  90
//           6.0x = 96  100 104

export const determineStreak = (day) => {
  const streakData = [
    {
      level: "Bronze",
      ranges: [
        [3, 5, 7, 2.0],  // star superstar champion
        [12, 15, 18, 2.5],  // icon hallOfFame invincible
        [24, 28, 32, 3.0],  // legend golden supreme
      ],
    },
    {
      level: "Silver",
      ranges: [
        [39, 41, 43, 3.5], // star superstar champion
        [48, 51, 54, 4.0],  // icon hallOfFame invincible
        [60, 64, 68, 4.5], // legend golden supreme
      ],
    },
    {
      level: "Gold",
      ranges: [
        [75, 77, 79, 5.0],  // star superstar champion
        [84, 87, 90, 5.5],  // icon hallOfFame invincible
        [96, 100, 104, 6.0],  // legend golden supreme
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
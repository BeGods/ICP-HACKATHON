type StreakResult = {
  level: "Bronze" | "Silver" | "Gold";
  multiplier: number;
  reward: "alchemist" | "automata" | "burst";
};
//                   A   B   C
//  Bronze:  2.0x = 03  05  07
//           2.5x = 12  15  18
//           3.0x = 24  28  32
//  Silver:  3.5x = 39  41  43
//           4.0x = 48  51  54
//           4.5x = 60  64  68
//  Gold:    5.0x = 75  77  79
//           5.5x = 84  87  90
//           6.0x = 96  100 104

export const determineStreak = (day: number): StreakResult | null => {
  const streakData = [
    {
      level: "Bronze",
      ranges: [
        [3, 5, 7, 2.0],
        [12, 15, 18, 2.5],
        [24, 28, 32, 3.0],
      ],
    },
    {
      level: "Silver",
      ranges: [
        [39, 41, 43, 3.5],
        [48, 51, 54, 4.0],
        [60, 64, 68, 4.5],
      ],
    },
    {
      level: "Gold",
      ranges: [
        [75, 77, 79, 5.0],
        [84, 87, 90, 5.5],
        [96, 100, 104, 6.0],
      ],
    },
  ];

  for (const { level, ranges } of streakData) {
    for (let i = 0; i < ranges.length; i++) {
      const [a, b, c, multiplier] = ranges[i];

      if (day === a)
        return {
          level: level as "Bronze" | "Silver" | "Gold",
          multiplier,
          reward: "alchemist",
        };
      if (day === b)
        return {
          level: level as "Bronze" | "Silver" | "Gold",
          multiplier,
          reward: "automata",
        };
      if (day === c)
        return {
          level: level as "Bronze" | "Silver" | "Gold",
          multiplier,
          reward: "burst",
        };
    }
  }

  return null; // no reward for this day
};

export const validStreakReward = (
  booster,
  streakCount,
  streakClaimedAt,
  isSameMyth
) => {
  const streakReward = determineStreak(streakCount);
  const now = new Date();
  const lastClaimedDate = new Date(streakClaimedAt ?? new Date(0));
  now.setUTCHours(0, 0, 0, 0);
  lastClaimedDate.setUTCHours(0, 0, 0, 0);

  // streak not claimed today
  if (lastClaimedDate.getTime() !== now.getTime()) {
    return 1;
  }

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

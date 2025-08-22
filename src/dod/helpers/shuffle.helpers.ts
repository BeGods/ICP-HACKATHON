import crypto from "crypto";

// new seed generator
export const seededRandom = (seed, iteration = 0) => {
  const hash = crypto
    .createHash("sha256")
    .update(seed + iteration.toString())
    .digest("hex");

  const num = parseInt(hash.substring(0, 8), 16);
  return num / 0xffffffff;
};

// Fisher-Yates shuffle with seed
export const shuffleArrayWithSeed = (array, seed, cycleNumber) => {
  const shuffled = [...array];
  const shuffleSeed = seed + "_cycle_" + cycleNumber;

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomValue = seededRandom(shuffleSeed, i);
    const j = Math.floor(randomValue * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export const drawCardsFromArray = (cardArray, cardCycle, cardsNeeded = 5) => {
  let drawnCards = [];
  let drawnIdxs = [];
  let remainingNeeded = cardsNeeded;

  const cycle = { ...cardCycle };

  while (remainingNeeded > 0) {
    let shuffledDeck = shuffleArrayWithSeed(
      cardArray,
      cycle.seed,
      cycle.currentCycle
    );

    // exclude already drawn cards
    if (drawnCards.length > 0 && cycle.cardsUsedInCycle === 0) {
      shuffledDeck = shuffledDeck.filter((card) => !drawnCards.includes(card));
    }

    // avaiable cards left in current cycle
    const availableInCycle = shuffledDeck.length - cycle.cardsUsedInCycle;

    if (availableInCycle >= remainingNeeded) {
      // draw all remaining cards
      const startIndex = cycle.cardsUsedInCycle;
      const endIndex = startIndex + remainingNeeded;

      const cycleCards = shuffledDeck.slice(startIndex, endIndex);
      drawnCards.push(...cycleCards);

      // non-shuffledd indicices
      drawnIdxs.push(...cycleCards.map((card) => cardArray.indexOf(card)));

      cycle.cardsUsedInCycle += remainingNeeded;
      remainingNeeded = 0;
    } else {
      // draw remaining cards left
      if (availableInCycle > 0) {
        const startIndex = cycle.cardsUsedInCycle;
        const cycleCards = shuffledDeck.slice(startIndex);
        drawnCards.push(...cycleCards);

        // non-shuffledd indicices
        drawnIdxs.push(...cycleCards.map((card) => cardArray.indexOf(card)));

        remainingNeeded -= availableInCycle;
      }

      // start new cycle
      cycle.currentCycle += 1;
      cycle.cardsUsedInCycle = 0;
    }
  }

  return {
    drawnCards,
    drawnIdxs,
    cycle,
  };
};

export const drawCardsAtPositions = (cardArray, indices) => {
  return indices
    .map((index) => cardArray[index])
    .filter((item) => item !== undefined);
};

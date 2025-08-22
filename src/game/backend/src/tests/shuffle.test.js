import crypto from "crypto"
import { drawCardsFromArray } from "../dod/helpers/shuffle.helpers";

function generateSeed() {
  return crypto.randomBytes(16).toString('hex');
}

function createNewCycle(seed = null) {
  return {
    currentCycle: 0,
    cardsUsedInCycle: 0,
    seed: seed || generateSeed()
  };
}


function testShuffler() {
  const testCards = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  let cycle = createNewCycle('test_seed_123');

  console.log("🎯 TESTING CARD SHUFFLER");
  console.log("Cards:", testCards);
  console.log("Seed:", cycle.seed);

  // Round 1: 5 cards
  console.log("\n" + "=".repeat(50));
  console.log("ROUND 1");
  let result1 = drawCardsFromArray(testCards, cycle, 5);
  cycle = result1.cycle;

  // Round 2: 5 cards
  console.log("\n" + "=".repeat(50));
  console.log("ROUND 2");
  let result2 = drawCardsFromArray(testCards, cycle, 5);
  cycle = result2.cycle;

  // Round 3: 5 cards (2 remaining + 3 from new cycle)
  console.log("\n" + "=".repeat(50));
  console.log("ROUND 3 (Cross-cycle)");
  let result3 = drawCardsFromArray(testCards, cycle, 5);
  cycle = result3.cycle;

  // Round 4
  console.log("\n" + "=".repeat(50));
  console.log("ROUND 4 (Cross-cycle)");
  let result4 = drawCardsFromArray(testCards, cycle, 5);
  cycle = result4.cycle;

  // Round 5
  console.log("\n" + "=".repeat(50));
  console.log("ROUND 5 (Cross-cycle)");
  let result5 = drawCardsFromArray(testCards, cycle, 5);
  cycle = result5.cycle;

  // Round 6
  console.log("\n" + "=".repeat(50));
  console.log("ROUND 6 (Cross-cycle)");
  let result6 = drawCardsFromArray(testCards, cycle, 5);
  cycle = result6.cycle;




  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 SUMMARY");
  console.log("Round 1:", result1.drawnCards);
  console.log("Round 2:", result2.drawnCards);
  console.log("Round 3:", result3.drawnCards);
  console.log("Round 4:", result4.drawnCards);
  console.log("Round 5:", result5.drawnCards);
  console.log("Final cycle:", cycle);
}



testShuffler();
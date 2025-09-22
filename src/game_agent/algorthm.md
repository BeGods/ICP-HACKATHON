# Personalized Contextual Bandit Algorithm for Gaming

## Abstract

This document presents a memory-efficient contextual bandit algorithm designed for real-time game difficulty adjustment in "Requiem of Relics" - a competitive swiping game deployed on ICP using Rust. The algorithm uses a two-layer approach: cluster-based matrices for general skill patterns and personal adjustment vectors for individual preferences. This design achieves true personalization for millions of users while maintaining low memory footprint (32MB vs 500MB+ for individual matrices) and preventing bias accumulation through confidence decay mechanisms.

## Algorithm Overview

### Core Architecture

The system operates through a **two-layer matrix approach**:

1. **Layer 1: Cluster Matrices** - 4 skill-based groups sharing learned patterns
2. **Layer 2: Personal Adjustments** - Individual preference vectors per user

**Memory Footprint:**

- Cluster matrices: 640 bytes total (4 clusters × 5 features × 8 difficulties × 4 bytes)
- User adjustments: 32MB for 1M users (8 adjustments × 4 bytes per user)
- **Total: ~32MB** (highly scalable)

### Player Classification System

Players are automatically classified into skill clusters based on recent performance:

```
IF win_rate < 20% OR streak < 3 days → Newbie
ELSE IF win_rate < 60% → Intermediate
ELSE IF win_rate < 80% → Skilled
ELSE → Expert
```

## Algorithm Flow with Examples

### Phase 1: Context Building

**Example: Alex (New Player)**

```
Raw Stats: 25% win rate, 1-day streak, 15 swipes/9sec, plays 2 days/week
Context Vector: [1.0, 0.25, 0.1, 0.43, 0.29]
Assigned Cluster: Newbie
```

### Phase 2: Difficulty Prediction

**Step 1: Cluster-Based Scoring**

The system multiplies Alex's context vector with the Newbie cluster matrix:

```
Newbie Cluster Matrix:
        [Diff5] [Diff10] [Diff15] [Diff20] [Diff25] [Diff30] [Diff35] [Diff40]
[Bias]   [ 3.8]  [ 4.2]   [ 2.1]   [ 1.5]   [ 1.0]   [ 0.8]   [ 0.6]   [ 0.4]
[WinRate][ 0.6]  [ 0.8]   [ 0.4]   [ 0.2]   [ 0.1]   [ 0.1]   [ 0.0]   [ 0.0]
[Streak] [ 0.4]  [ 0.5]   [ 0.2]   [ 0.1]   [ 0.0]   [ 0.0]   [ 0.0]   [ 0.0]
[Speed]  [ 0.3]  [ 0.4]   [ 0.3]   [ 0.1]   [ 0.0]   [ 0.0]   [ 0.0]   [ 0.0]
[Freq]   [ 0.2]  [ 0.3]   [ 0.1]   [ 0.0]   [ 0.0]   [ 0.0]   [ 0.0]   [ 0.0]

Cluster Scores:
Diff5:  1×3.8 + 0.25×0.6 + 0.1×0.4 + 0.43×0.3 + 0.29×0.2 = 4.177
Diff10: 1×4.2 + 0.25×0.8 + 0.1×0.5 + 0.43×0.4 + 0.29×0.3 = 4.509
Diff15: 1×2.1 + 0.25×0.4 + 0.1×0.2 + 0.43×0.3 + 0.29×0.1 = 2.278
```

**Step 2: Personal Adjustment**

Alex's personal adjustments (new user starts with zeros):

```
[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

Final Scores:
Diff5:  4.177 + 0.0 = 4.177
Diff10: 4.509 + 0.0 = 4.509 ← Highest Score
Diff15: 2.278 + 0.0 = 2.278

Selected Difficulty: 10
```

### Phase 3: Gameplay & Reward

**Alex's Game Result:**

- Required: 10 swipes to win
- Alex's Performance: 12 swipes, wins the round
- Performance Ratio: 12/10 = 1.2

**Reward Calculation:**

```
Base reward: 1.0 (win)
Performance ratio: 1.2
Engagement bonus: min(0.3, 1.2 × 0.2) = 0.24
Appropriateness bonus: 0.2 (perfect challenge)
Total Reward: 1.44
```

### Phase 4: Learning Updates

**Error Calculation:**

```
Predicted Score: 4.509
Actual Reward: 1.44
Error: 1.44 - 4.509 = -3.069
```

**Cluster Matrix Update (Learning Rate = 0.01):**

```
Updated Diff10 column in Newbie matrix:
Bias: 4.2 + (0.01 × -3.069 × 1.0) = 4.169
WinRate: 0.8 + (0.01 × -3.069 × 0.25) = 0.792
Streak: 0.5 + (0.01 × -3.069 × 0.1) = 0.497
```

**Personal Adjustment Update (Learning Rate = 0.1):**

```
Alex's new adjustments: [0.0, -0.307, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
```

_Alex's system learns he found Diff10 slightly too easy_

## Evolution Over Time

### Alex After 30 Games (2 Weeks)

**Updated Profile:**

```
Stats: 65% win rate, 14-day streak, 22 swipes/9sec, plays 5 days/week
Cluster: Intermediate (promoted)
Context Vector: [1, 0.65, 0.7, 0.63, 0.71]
Personal Adjustments: [+0.1, -0.2, +0.3, +0.6, +0.4, -0.1, -0.3, -0.2]
```

**New Prediction (Round 31):**

```
Intermediate cluster prefers higher difficulties
Alex's personal pattern: Loves Diff20 and Diff25

Cluster Scores:
Diff20: 7.238
Diff25: 7.370

Final Scores:
Diff20: 7.238 + 0.6 = 7.838 ← Selected
Diff25: 7.370 + 0.4 = 7.770

Selected Difficulty: 20 (Alex's sweet spot!)
```

### Maya - Expert Player Journey

**Initial State:**

```
Expert Player: 85% win rate, 30-day streak, 32 swipes/9sec
First Prediction: Difficulty 35 (challenging but appropriate)
Game Result: 38 swipes, wins → Total Reward: 1.417
```

**After 50 Games:**

```
Slightly declined performance: 78% win rate
Personal Adjustments: [+0.2, +0.1, -0.1, -0.3, -0.5, +0.2, +0.7, +0.3]
System learned: Maya strongly prefers Diff35, dislikes mid-range

On a challenging day:
- Maya struggles: 31 swipes, loses at Diff35
- System adapts: Personal adjustment for Diff35 drops from +0.7 to -0.4
- Next prediction: Will suggest Diff30 when Maya shows similar struggle patterns
```

## Key Algorithm Features

### Confidence Decay System

```
Learning Rate = base_rate × (1 / (1 + updates/1000))
```

As more data is collected, learning rate decreases, preventing over-saturation and maintaining stability.

### Multi-Factor Rewards

The system considers multiple aspects of player engagement:

- **Win/Loss**: Basic success metric
- **Effort Level**: How much the player tried (swipe count)
- **Appropriateness**: Bonus for optimal challenge level

### Bias Prevention

- Periodic matrix resets (every 50,000 updates)
- Separate learning rates for cluster vs personal learning
- Confidence-based weight decay

## Conclusion

This two-layer contextual bandit algorithm achieves true personalization while maintaining efficiency - scaling to millions of users with just 32MB memory overhead. By combining cluster-based learning with individual adjustments, the system adapts to both general skill patterns and personal preferences. Confidence decay mechanisms ensure long-term stability, while real-time learning keeps players in their optimal challenge zone for maximum engagement and retention.

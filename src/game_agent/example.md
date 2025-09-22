# Example 1: Alex - New Player Journey

## Initial State (Day 1)

### **User Profile: Alex**

- **Stats**: 25% win rate, 1-day streak, 15 swipes/9sec average, plays 2 days/week
- **Cluster**: Newbie (based on low win rate and streak)
- **Context Vector**: X = [1, 0.25, 0.1, 0.43, 0.29]

### **Fresh Newbie Cluster Matrix (Limited Training)**

```
        [Diff5] [Diff10] [Diff15] [Diff20] [Diff25] [Diff30] [Diff35] [Diff40]
[Bias]   [ 3.8]  [ 4.2]   [ 2.1]   [ 1.5]   [ 1.0]   [ 0.8]   [ 0.6]   [ 0.4]
[WinRate][ 0.6]  [ 0.8]   [ 0.4]   [ 0.2]   [ 0.1]   [ 0.1]   [ 0.0]   [ 0.0]
[Streak] [ 0.4]  [ 0.5]   [ 0.2]   [ 0.1]   [ 0.0]   [ 0.0]   [ 0.0]   [ 0.0]
[Speed]  [ 0.3]  [ 0.4]   [ 0.3]   [ 0.1]   [ 0.0]   [ 0.0]   [ 0.0]   [ 0.0]
[Freq]   [ 0.2]  [ 0.3]   [ 0.1]   [ 0.0]   [ 0.0]   [ 0.0]   [ 0.0]   [ 0.0]
```

### **Alex's Personal Adjustments (New User)**

```
[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] - All neutral initially
```

## Round 1 Prediction

### **Cluster Scores Calculation**

```
Diff5:  1×3.8 + 0.25×0.6 + 0.1×0.4 + 0.43×0.3 + 0.29×0.2 = 3.8 + 0.15 + 0.04 + 0.129 + 0.058 = 4.177
Diff10: 1×4.2 + 0.25×0.8 + 0.1×0.5 + 0.43×0.4 + 0.29×0.3 = 4.2 + 0.20 + 0.05 + 0.172 + 0.087 = 4.509
Diff15: 1×2.1 + 0.25×0.4 + 0.1×0.2 + 0.43×0.3 + 0.29×0.1 = 2.1 + 0.10 + 0.02 + 0.129 + 0.029 = 2.278
```

### **Final Scores (Cluster + Personal)**

```
Diff5:  4.177 + 0.0 = 4.177
Diff10: 4.509 + 0.0 = 4.509 ← Highest, Selected!
Diff15: 2.278 + 0.0 = 2.278
```

**Selected Difficulty: 10**

### **Game Result**

- Alex swipes 12 times, wins the round
- **Reward Calculation**:
  - Base reward: 1.0 (win)
  - Performance ratio: 12/10 = 1.2
  - Engagement bonus: min(0.3, 1.2 × 0.2) = 0.24
  - Appropriateness bonus: 0.2 (perfect challenge range)
  - **Total Reward: 1.44**

### **Update Process**

**Error Calculation:**

```
Predicted score: 4.509
Actual reward: 1.44
Error: 1.44 - 4.509 = -3.069
```

**Cluster Matrix Update (Learning Rate = 0.01):**

```
New weights for Diff10 column:
Bias: 4.2 + (0.01 × -3.069 × 1) = 4.2 - 0.031 = 4.169
WinRate: 0.8 + (0.01 × -3.069 × 0.25) = 0.8 - 0.008 = 0.792
Streak: 0.5 + (0.01 × -3.069 × 0.1) = 0.5 - 0.003 = 0.497
Speed: 0.4 + (0.01 × -3.069 × 0.43) = 0.4 - 0.013 = 0.387
Freq: 0.3 + (0.01 × -3.069 × 0.29) = 0.3 - 0.009 = 0.291
```

**Alex's Personal Adjustment Update (Learning Rate = 0.1):**

```
Personal error: 1.44 - 4.509 = -3.069
New adjustment for Diff10: 0.0 + (0.1 × -3.069) = -0.307

Alex's new adjustments: [0.0, -0.307, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
```

---

## After 30 Games (2 Weeks Later)

### **Alex's Evolved Profile**

- **Stats**: 65% win rate, 14-day streak, 22 swipes/9sec average, plays 5 days/week
- **Cluster**: Intermediate (promoted due to improved performance)
- **Context Vector**: X = [1, 0.65, 0.7, 0.63, 0.71]

### **Updated Intermediate Cluster Matrix (After Many Users)**

```
        [Diff5] [Diff10] [Diff15] [Diff20] [Diff25] [Diff30] [Diff35] [Diff40]
[Bias]   [ 2.1]  [ 3.2]   [ 3.9]   [ 4.1]   [ 3.7]   [ 2.8]   [ 2.0]   [ 1.2]
[WinRate][ 0.2]  [ 0.8]   [ 1.4]   [ 1.8]   [ 2.1]   [ 1.6]   [ 1.0]   [ 0.5]
[Streak] [ 0.1]  [ 0.4]   [ 0.8]   [ 1.1]   [ 1.3]   [ 1.2]   [ 0.8]   [ 0.4]
[Speed]  [ 0.1]  [ 0.3]   [ 0.7]   [ 1.0]   [ 1.2]   [ 1.4]   [ 1.1]   [ 0.6]
[Freq]   [ 0.2]  [ 0.5]   [ 0.6]   [ 0.8]   [ 0.9]   [ 1.0]   [ 0.8]   [ 0.5]
```

### **Alex's Evolved Personal Adjustments**

```
[+0.1, -0.2, +0.3, +0.6, +0.4, -0.1, -0.3, -0.2]
```

_Learned preferences: Loves Diff20 and Diff25, dislikes very easy and very hard_

### **Round 31 Prediction**

**Cluster Scores:**

```
Diff20: 1×4.1 + 0.65×1.8 + 0.7×1.1 + 0.63×1.0 + 0.71×0.8 = 4.1 + 1.17 + 0.77 + 0.63 + 0.568 = 7.238
Diff25: 1×3.7 + 0.65×2.1 + 0.7×1.3 + 0.63×1.2 + 0.71×0.9 = 3.7 + 1.365 + 0.91 + 0.756 + 0.639 = 7.370
```

**Final Scores:**

```
Diff20: 7.238 + 0.6 = 7.838
Diff25: 7.370 + 0.4 = 7.770
```

**Selected Difficulty: 20** (Alex's personal sweet spot!)

---

# Example 2: Maya - Expert Player Evolution

## Initial State (Day 1)

### **User Profile: Maya (Experienced Gamer)**

- **Stats**: 85% win rate, 30-day streak, 32 swipes/9sec average, plays daily
- **Cluster**: Expert
- **Context Vector**: X = [1, 0.85, 1.0, 0.91, 1.0]

### **Expert Cluster Matrix (Well-Trained)**

```
        [Diff5] [Diff10] [Diff15] [Diff20] [Diff25] [Diff30] [Diff35] [Diff40]
[Bias]   [ 1.0]  [ 1.2]   [ 1.8]   [ 2.5]   [ 3.2]   [ 4.1]   [ 4.5]   [ 3.8]
[WinRate][ 0.1]  [ 0.2]   [ 0.5]   [ 1.1]   [ 1.6]   [ 2.2]   [ 2.5]   [ 2.1]
[Streak] [ 0.0]  [ 0.1]   [ 0.3]   [ 0.7]   [ 1.1]   [ 1.5]   [ 1.7]   [ 1.4]
[Speed]  [ 0.0]  [ 0.1]   [ 0.4]   [ 0.8]   [ 1.2]   [ 1.6]   [ 1.9]   [ 1.7]
[Freq]   [ 0.0]  [ 0.0]   [ 0.2]   [ 0.5]   [ 0.8]   [ 1.1]   [ 1.3]   [ 1.2]
```

### **Maya's Personal Adjustments (New User)**

```
[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
```

## Round 1 Prediction

### **Cluster Scores:**

```
Diff35: 1×4.5 + 0.85×2.5 + 1.0×1.7 + 0.91×1.9 + 1.0×1.3 = 4.5 + 2.125 + 1.7 + 1.729 + 1.3 = 11.354
Diff40: 1×3.8 + 0.85×2.1 + 1.0×1.4 + 0.91×1.7 + 1.0×1.2 = 3.8 + 1.785 + 1.4 + 1.547 + 1.2 = 9.732
```

**Selected Difficulty: 35**

### **Game Result**

- Maya swipes 38 times, wins the round
- **Reward Calculation**:
  - Base reward: 1.0
  - Performance ratio: 38/35 = 1.086
  - Engagement bonus: min(0.3, 1.086 × 0.2) = 0.217
  - Appropriateness bonus: 0.2
  - **Total Reward: 1.417**

### **Update Process**

```
Error: 1.417 - 11.354 = -9.937

Cluster Update (Learning Rate = 0.008, lower due to many expert updates):
Diff35 Bias: 4.5 + (0.008 × -9.937 × 1) = 4.5 - 0.079 = 4.421

Personal Update:
Maya's Diff35 adjustment: 0.0 + (0.1 × -9.937) = -0.994
```

---

## After 50 Games (6 Weeks Later)

### **Maya's Profile (Slightly Declined)**

- **Stats**: 78% win rate, 25-day streak, 29 swipes/9sec, plays 6 days/week
- **Cluster**: Still Expert, but stats show slight decline
- **Context Vector**: X = [1, 0.78, 0.83, 0.83, 0.86]

### **Maya's Learned Personal Adjustments**

```
[+0.2, +0.1, -0.1, -0.3, -0.5, +0.2, +0.7, +0.3]
```

_Learned: Strongly prefers Diff35, dislikes mid-range difficulties_

### **Round 51 Prediction**

**Cluster Scores (Updated Matrix):**

```
Diff30: 1×4.1 + 0.78×2.2 + 0.83×1.5 + 0.83×1.6 + 0.86×1.1 = 4.1 + 1.716 + 1.245 + 1.328 + 0.946 = 9.335
Diff35: 1×4.421 + 0.78×2.5 + 0.83×1.7 + 0.83×1.9 + 0.86×1.3 = 4.421 + 1.95 + 1.411 + 1.577 + 1.118 = 10.477
```

**Final Scores:**

```
Diff30: 9.335 + 0.2 = 9.535
Diff35: 10.477 + 0.7 = 11.177 ← Selected
```

**Selected Difficulty: 35** (Maya's consistent preference!)

### **Game Result (Challenging Day)**

- Maya swipes 31 times, loses the round (having an off day)
- **Reward Calculation**:
  - Base reward: 0.0 (loss)
  - Performance ratio: 31/35 = 0.886
  - Engagement bonus: min(0.3, 0.886 × 0.2) = 0.177
  - Appropriateness bonus: 0.0 (didn't win)
  - **Total Reward: 0.177**

### **Adaptive Update**

```
Error: 0.177 - 11.177 = -11.0

Personal Update:
Maya's Diff35 adjustment: 0.7 + (0.1 × -11.0) = 0.7 - 1.1 = -0.4

New adjustments: [+0.2, +0.1, -0.1, -0.3, -0.5, +0.2, -0.4, +0.3]
```

**Result**: System learns that Diff35 might be too hard when Maya is having an off day, will suggest Diff30 next time with similar performance indicators.

---

## Key Observations

### **Alex's Journey:**

- Started with cluster-driven predictions (Diff10)
- Personal adjustments learned his preferences for moderate challenges
- Smoothly transitioned between clusters as skills improved
- Final state: Personalized difficulty around Diff20-25

### **Maya's Journey:**

- Started with expert-level predictions (Diff35)
- System learned her specific preference for Diff35 over Diff40
- Adapted when performance declined, suggesting slightly easier challenges
- Personal adjustments prevented over-challenging during off days

### **Matrix Evolution:**

- Learning rates decreased over time (confidence decay)
- Cluster matrices stabilized around user-population preferences
- Personal adjustments captured individual quirks beyond cluster averages
- System balanced challenge with engagement for both player types

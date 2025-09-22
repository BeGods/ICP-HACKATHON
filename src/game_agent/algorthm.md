# Final Memory-Efficient Personalized Contextual Bandit Algorithm

## Core Architecture

### **1. Two-Layer Matrix System**

- **Layer 1**: 4 Cluster-Based Matrices (160 total weights)
  - Newbie Cluster (0-20% win rate)
  - Intermediate Cluster (20-60% win rate)
  - Skilled Cluster (60-80% win rate)
  - Expert Cluster (80%+ win rate)
- **Layer 2**: User-Specific Adjustment Vectors (8 scalars per user)
  - One adjustment value per difficulty level
  - Captures individual preferences beyond cluster behavior

### **2. Memory Footprint**

- Cluster matrices: 640 bytes total
- User adjustments: 32MB for 1M users
- **Total: ~32MB (vs 500MB+ for individual matrices)**

## Algorithm Flow

### **Phase 1: User Classification & Context Building**

1. **Fetch User Stats from MongoDB**
   - Recent win rate, streak days, average swipe speed, session frequency
2. **Classify User into Cluster**
   - Calculate cluster based on performance metrics
   - Assign to appropriate skill-level cluster
3. **Build Context Vector**
   - Normalize all features to 0.0-1.0 range
   - Create vector: X = [1, win_rate, streak, speed, frequency]

### **Phase 2: Difficulty Prediction**

4. **Calculate Cluster Predictions**

   - For each difficulty level (5,10,15,20,25,30,35,40):
   - Score = Context_Vector · Cluster_Matrix_Column
   - Get 8 cluster-based scores

5. **Add Personal Adjustments**

   - Retrieve user's 8 personal adjustment values
   - Final_Score[i] = Cluster_Score[i] + Personal_Adjustment[i]

6. **Select Optimal Difficulty**
   - Choose difficulty with highest final score
   - Return actual difficulty value (not the score)

### **Phase 3: Gameplay & Reward Calculation**

7. **User Plays Round**

   - Present selected difficulty to user
   - Track performance: swipes achieved, win/loss

8. **Calculate Multi-Factor Reward**
   - Base reward: 1.0 for win, 0.0 for loss
   - Engagement bonus: based on swipes vs difficulty ratio
   - Appropriateness bonus: extra reward for optimal challenge level
   - Cap total reward at reasonable maximum (e.g., 2.0)

### **Phase 4: Learning & Updates**

9. **Calculate Prediction Errors**

   - Cluster error = reward - cluster_prediction
   - Personal error = reward - total_prediction

10. **Update Cluster Matrix (Slow Learning)**

    - Use confidence-based learning rate that decreases with update count
    - Learning_Rate = base_rate × (1 / (1 + updates/1000))
    - Update only the selected difficulty's weights
    - Queue update to avoid concurrency issues

11. **Update Personal Adjustments (Fast Learning)**
    - Use fixed higher learning rate (e.g., 0.1)
    - Directly adjust user's preference for selected difficulty
    - Update immediately in user's adjustment vector

### **Phase 5: Bias Prevention & Maintenance**

12. **Confidence Decay System**

    - Track update counts per cluster and difficulty
    - Reduce learning rate as matrices stabilize
    - Prevent over-saturation from excessive updates

13. **Periodic Matrix Reset**

    - Every 50,000 updates, apply gentle decay (multiply by 0.95)
    - Reset update counts to allow renewed learning
    - Maintain learned patterns while preventing rigid bias

14. **Concurrency Handling**
    - Use read-only matrices for predictions (no locking needed)
    - Queue all updates for batch processing
    - Process updates asynchronously every 1-2 seconds
    - Maintain eventual consistency across concurrent users

## Mathematical Formulas

### **Cluster Classification**

```
IF win_rate < 0.2 OR streak < 3 THEN cluster = "newbie"
ELSE IF win_rate < 0.6 THEN cluster = "intermediate"
ELSE IF win_rate < 0.8 THEN cluster = "skilled"
ELSE cluster = "expert"
```

### **Final Difficulty Selection**

```
FOR each difficulty_level i:
    cluster_score[i] = context_vector · cluster_matrix[:, i]
    final_score[i] = cluster_score[i] + user_adjustments[i]

selected_difficulty = difficulty_levels[argmax(final_scores)]
```

### **Reward Calculation**

```
base_reward = 1.0 if won else 0.0
performance_ratio = user_swipes / difficulty_level
engagement_bonus = min(0.3, performance_ratio × 0.2)
appropriateness_bonus = 0.2 if 0.8 ≤ performance_ratio ≤ 1.2 else 0.0
total_reward = min(2.0, base_reward + engagement_bonus + appropriateness_bonus)
```

### **Learning Rate with Confidence Decay**

```
base_learning_rate = 0.01
update_count = total_updates_for_this_action
confidence_factor = 1.0 / (1.0 + update_count / 1000.0)
actual_learning_rate = base_learning_rate × confidence_factor
```

### **Matrix Updates**

```
Cluster Update:
new_weight = old_weight + learning_rate × error × context_feature

Personal Update:
new_adjustment = old_adjustment + 0.1 × personal_error
```

## Key Benefits

### **Personalization**

- Each user gets truly customized difficulty based on cluster + personal preferences
- Fast adaptation to individual playing patterns
- Maintains good predictions for new users through cluster baseline

### **Scalability**

- Handles millions of concurrent users with minimal memory
- Async update system prevents performance bottlenecks
- Read-heavy workload optimized for gaming scenarios

### **Stability**

- Confidence decay prevents over-learning and bias accumulation
- Periodic resets maintain adaptability over time
- Separate learning rates for cluster vs personal adjustments

### **Intelligence**

- Balances exploration vs exploitation through uncertainty bonuses
- Learns both general skill-level patterns and individual quirks
- Adapts to changing user behavior and game meta evolution

This algorithm provides true personalization with enterprise-grade scalability while avoiding the bias accumulation problems of simpler approaches.

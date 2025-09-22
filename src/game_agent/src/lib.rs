use candid::{CandidType, Deserialize};
use ic_cdk::api::management_canister::provisional::CanisterId;
use ic_cdk_macros::*;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
use std::collections::HashMap;

// diffculty levels
const DIFFICULTIES: [u32; 8] = [5, 10, 15, 20, 25, 30, 35, 40];

// feature vector size: bias + win_rate + streak + speed + frequency = 5
const FEATURE_DIM: usize = 5;
const NUM_DIFF: usize = 8;

type Memory = VirtualMemory<DefaultMemoryImpl>;

// clusters based on player exp
#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash, CandidType, Deserialize)]
pub enum Cluster {
    Newbie,
    Intermediate,
    Skilled,
    Expert,
}

impl Cluster {
    pub fn all() -> [Cluster; 4] {
        [Cluster::Newbie, Cluster::Intermediate, Cluster::Skilled, Cluster::Expert]
    }
}

// main feature matrix FEATURE_DIM x NUM_DIFF
// rows = features, cols = difficulties
// track update counts per difficulty column
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ClusterMatrix {
    pub weights: [[f32; NUM_DIFF]; FEATURE_DIM],
    pub update_counts: [u64; NUM_DIFF],
}

impl ClusterMatrix {
    pub fn new(init: [[f32; NUM_DIFF]; FEATURE_DIM]) -> Self {
        Self { weights: init, update_counts: [0; NUM_DIFF] }
    }

    // compute cluster scores: context_vector for each column
    pub fn scores(&self, context: &[f32; FEATURE_DIM]) -> [f32; NUM_DIFF] {
        let mut out = [0.0f32; NUM_DIFF];
        for col in 0..NUM_DIFF {
            let mut s = 0.0f32;
            for row in 0..FEATURE_DIM {
                s += context[row] * self.weights[row][col];
            }
            out[col] = s;
        }
        out
    }

    // update a single column (difficulty) using given learning_rate, error and context
    pub fn update_column(&mut self, col: usize, learning_rate: f32, error: f32, context: &[f32; FEATURE_DIM]) {
        for row in 0..FEATURE_DIM {
            let delta = learning_rate * error * context[row];
            self.weights[row][col] += delta;
        }
        self.update_counts[col] = self.update_counts[col].saturating_add(1);
    }

    // apply decay to entire matrix 
    pub fn decay(&mut self, factor: f32) {
        for row in 0..FEATURE_DIM {
            for col in 0..NUM_DIFF {
                self.weights[row][col] *= factor;
            }
        }
        // reset counts to zero to allow renewed learning
        self.update_counts = [0; NUM_DIFF];
    }
}

// bandit model that manages clusters for every user ( personalizatoin )
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct PersonalizedBandit {
    clusters: HashMap<Cluster, ClusterMatrix>,
    user_adjustments: HashMap<String, [f32; NUM_DIFF]>,
    base_cluster_lr: f32, // base learning rates and parameters
    personal_lr: f32,
}

impl PersonalizedBandit {
    pub fn new() -> Self {
        // intialize cluster matrices with defaults 
        let newbie_init: [[f32; NUM_DIFF]; FEATURE_DIM] = [
            // bias
            [3.8, 4.2, 2.1, 1.5, 1.0, 0.8, 0.6, 0.4],
            // win_rate
            [0.6, 0.8, 0.4, 0.2, 0.1, 0.1, 0.0, 0.0],
            // streak
            [0.4, 0.5, 0.2, 0.1, 0.0, 0.0, 0.0, 0.0],
            // speed
            [0.3, 0.4, 0.3, 0.1, 0.0, 0.0, 0.0, 0.0],
            // frequency
            [0.2, 0.3, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0],
        ];

        let intermediate_init: [[f32; NUM_DIFF]; FEATURE_DIM] = [
            [2.1, 3.2, 3.9, 4.1, 3.7, 2.8, 2.0, 1.2],
            [0.2, 0.8, 1.4, 1.8, 2.1, 1.6, 1.0, 0.5],
            [0.1, 0.4, 0.8, 1.1, 1.3, 1.2, 0.8, 0.4],
            [0.1, 0.3, 0.7, 1.0, 1.2, 1.4, 1.1, 0.6],
            [0.2, 0.5, 0.6, 0.8, 0.9, 1.0, 0.8, 0.5],
        ];

        let skilled_init: [[f32; NUM_DIFF]; FEATURE_DIM] = [
            [1.6, 2.5, 3.2, 3.7, 3.5, 3.0, 2.5, 1.8],
            [0.15, 0.4, 0.9, 1.3, 1.6, 1.8, 1.6, 1.0],
            [0.05, 0.2, 0.5, 0.9, 1.1, 1.2, 1.1, 0.7],
            [0.05, 0.2, 0.6, 0.9, 1.1, 1.5, 1.6, 1.0],
            [0.05, 0.2, 0.35, 0.6, 0.8, 0.9, 1.0, 0.9],
        ];

        let expert_init: [[f32; NUM_DIFF]; FEATURE_DIM] = [
            [1.0, 1.2, 1.8, 2.5, 3.2, 4.1, 4.5, 3.8],
            [0.1, 0.2, 0.5, 1.1, 1.6, 2.2, 2.5, 2.1],
            [0.0, 0.1, 0.3, 0.7, 1.1, 1.5, 1.7, 1.4],
            [0.0, 0.1, 0.4, 0.8, 1.2, 1.6, 1.9, 1.7],
            [0.0, 0.0, 0.2, 0.5, 0.8, 1.1, 1.3, 1.2],
        ];

        let mut clusters = HashMap::new();
        clusters.insert(Cluster::Newbie, ClusterMatrix::new(newbie_init));
        clusters.insert(Cluster::Intermediate, ClusterMatrix::new(intermediate_init));
        clusters.insert(Cluster::Skilled, ClusterMatrix::new(skilled_init));
        clusters.insert(Cluster::Expert, ClusterMatrix::new(expert_init));

        Self {
            clusters,
            user_adjustments: HashMap::new(),
            base_cluster_lr: 0.01,
            personal_lr: 0.1,
        }
    }

    // check user has an adjustment vector 
    fn ensure_user(&mut self, user_id: &str) {
        if !self.user_adjustments.contains_key(user_id) {
            self.user_adjustments.insert(user_id.to_string(), [0.0f32; NUM_DIFF]); // (defaults to zeros)
        }
    }

    // classify user into cluster based on win rate and streak ( exp )
    pub fn classify_user(&self, win_rate: f32, streak_days: f32) -> Cluster {
        if win_rate < 0.2 || streak_days < 3.0 {
            Cluster::Newbie
        } else if win_rate < 0.6 {
            Cluster::Intermediate
        } else if win_rate < 0.8 {
            Cluster::Skilled
        } else {
            Cluster::Expert
        }
    }

    // normalized context vector X = [1, win_rate, streak, speed, frequency] with normalized inputs
    pub fn build_context(&self, win_rate: f32, streak_norm: f32, speed_norm: f32, freq_norm: f32) -> [f32; FEATURE_DIM] {
        [1.0, win_rate.clamp(0.0, 1.0), streak_norm.clamp(0.0, 1.0), speed_norm.clamp(0.0, 1.0), freq_norm.clamp(0.0, 1.0)]
    }

    // predict: returns (cluster_scores, final_scores (cluster + personal), chosen_index)
    pub fn predict_and_select(&mut self, user_id: &str, cluster: Cluster, context: &[f32; FEATURE_DIM]) -> ([f32; NUM_DIFF], [f32; NUM_DIFF], usize) {
        self.ensure_user(user_id);
        let cm = self.clusters.get(&cluster).expect("cluster missing");
        let cluster_scores = cm.scores(context);
        let adjustments = self.user_adjustments.get(user_id).unwrap();
        let mut final_scores = [0.0f32; NUM_DIFF];
        for i in 0..NUM_DIFF {
            final_scores[i] = cluster_scores[i] + adjustments[i];
        }
        let mut best_idx = 0usize;
        for i in 1..NUM_DIFF {
            if final_scores[i] > final_scores[best_idx] {
                best_idx = i;
            }
        }
        (cluster_scores, final_scores, best_idx)
    }

    // based on prediction compute rewards (+- to the model for feedback)
    pub fn compute_reward(&self, won: bool, user_swipes: f32, difficulty: f32) -> f32 {
        let base_reward = if won { 1.0 } else { 0.0 };
        let performance_ratio = if difficulty <= 0.0 { 0.0 } else { user_swipes / difficulty };
        let engagement_bonus = (performance_ratio * 0.2).min(0.3);
        let appropriateness_bonus = if performance_ratio >= 0.8 && performance_ratio <= 1.2 { 0.2 } else { 0.0 };
        (base_reward + engagement_bonus + appropriateness_bonus).min(2.0)
    }

    // learning_rate reduction as user plays
    fn compute_cluster_lr(&self, base_lr: f32, update_count: u64) -> f32 {
        let confidence_factor = 1.0 / (1.0 + (update_count as f32) / 1000.0);
        base_lr * confidence_factor
    }

    // Apply updates after outcome: selected difficulty index, reward, cluster_score and personal prediction
    pub fn apply_updates(&mut self, user_id: &str, cluster: Cluster, context: &[f32; FEATURE_DIM], selected_idx: usize, reward: f32, cluster_pred: f32, total_pred: f32) {
        self.ensure_user(user_id);
        let cluster_error = reward - cluster_pred;
        let personal_error = reward - total_pred;
    
        // cluster matrix update
        let update_count = {
            let cm_ref = self.clusters.get(&cluster).expect("cluster missing for update");
            cm_ref.update_counts[selected_idx]
        };
        let lr = self.compute_cluster_lr(self.base_cluster_lr, update_count);
        let cm = self.clusters.get_mut(&cluster).expect("cluster missing for update");
        cm.update_column(selected_idx, lr, cluster_error, context);
    
        // user personal matrix update
        if let Some(adj) = self.user_adjustments.get_mut(user_id) {
            adj[selected_idx] += self.personal_lr * personal_error;
        }
    
        println!("--- After update for user {} ---", user_id);
        println!("Cluster {:?} matrix weights: {:#?}", cluster, cm.weights);
        println!("Personalized adjustments for {}: {:#?}", user_id, self.user_adjustments[user_id]);
    }

    // periodic decay to allow fresh oreductions
    pub fn periodic_decay(&mut self, decay_every_updates: u64, decay_factor: f32) {
        for (_cluster, cm) in self.clusters.iter_mut() {
            let total_updates: u64 = cm.update_counts.iter().sum();
            if total_updates >= decay_every_updates {
                cm.decay(decay_factor);
            }
        }
    }
}

// response types for canister functions
#[derive(CandidType, Deserialize)]
pub struct DifficultyResponse {
    pub difficulty: u32,
    pub cluster: Cluster,
    pub difficulty_index: usize,
}

#[derive(CandidType, Deserialize)]
pub struct RewardResponse {
    pub reward: f32,
    pub updated: bool,
}

//  state management
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    
    static BANDIT_MODEL: RefCell<PersonalizedBandit> = RefCell::new(PersonalizedBandit::new());
}

// ICP Canister Functions
#[init]
fn init() {
    BANDIT_MODEL.with(|bandit| {
        *bandit.borrow_mut() = PersonalizedBandit::new();
    });
}

#[update]
fn compute_difficulty(
    user_id: String,
    win_rate: f32,
    streak_days: f32,
    streak_norm: f32,
    speed_norm: f32,
    freq_norm: f32,
) -> DifficultyResponse {
    BANDIT_MODEL.with(|bandit| {
        let mut bandit = bandit.borrow_mut();
        
        let context = bandit.build_context(win_rate, streak_norm, speed_norm, freq_norm);
        let cluster = bandit.classify_user(win_rate, streak_days);
        let (_, _, idx) = bandit.predict_and_select(&user_id, cluster, &context);
        let chosen_difficulty = DIFFICULTIES[idx];
        
        DifficultyResponse {
            difficulty: chosen_difficulty,
            cluster,
            difficulty_index: idx,
        }
    })
}

#[update]
fn update_model_with_reward(
    user_id: String,
    won: bool,
    user_swipes: f32,
    difficulty: f32,
    win_rate: f32,
    streak_days: f32,
    streak_norm: f32,
    speed_norm: f32,
    freq_norm: f32,
    difficulty_index: usize,
) -> RewardResponse {
    BANDIT_MODEL.with(|bandit| {
        let mut bandit = bandit.borrow_mut();
        
        let context = bandit.build_context(win_rate, streak_norm, speed_norm, freq_norm);
        let cluster = bandit.classify_user(win_rate, streak_days);
        let reward = bandit.compute_reward(won, user_swipes, difficulty);
        
        let (cluster_scores, final_scores, _) = bandit.predict_and_select(&user_id, cluster, &context);
        
        bandit.apply_updates(
            &user_id,
            cluster,
            &context,
            difficulty_index,
            reward,
            cluster_scores[difficulty_index],
            final_scores[difficulty_index],
        );
        
        RewardResponse {
            reward,
            updated: true,
        }
    })
}

#[query]
fn get_user_cluster(user_id: String, win_rate: f32, streak_days: f32) -> Cluster {
    BANDIT_MODEL.with(|bandit| {
        let bandit = bandit.borrow();
        bandit.classify_user(win_rate, streak_days)
    })
}

#[update]
fn apply_periodic_decay(decay_every_updates: u64, decay_factor: f32) -> bool {
    BANDIT_MODEL.with(|bandit| {
        let mut bandit = bandit.borrow_mut();
        bandit.periodic_decay(decay_every_updates, decay_factor);
        true
    })
}

ic_cdk::export_candid!();





// TEST SIMULATIONS
// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn simulate_alex_round() {
//         let mut bandit = PersonalizedBandit::new();

//         // Alex initial state (Day 1)
//         let user_id = "alex";
//         let win_rate = 0.25; // 25%
//         let streak_norm = 0.1; // normalized 1 day -> 0.1 (example)
//         let speed_norm = 0.43; // normalized
//         let freq_norm = 0.29; // normalized

//         let cluster = bandit.classify_user(win_rate, 1.0);
//         let context = bandit.build_context(win_rate, streak_norm, speed_norm, freq_norm);

//         let (cluster_scores, final_scores, idx) = bandit.predict_and_select(user_id, cluster, &context);
//         let chosen_diff = DIFFICULTIES[idx] as f32;

//         println!("Alex chosen difficulty: {} (idx={})", chosen_diff, idx);

//         // Simulate a game: Alex swipes 12 times and wins
//         let user_swipes = 12.0;
//         let won = true;
//         let reward = bandit.compute_reward(won, user_swipes, chosen_diff);

//         // update cluster_pred = cluster_scores[idx], total_pred = final_scores[idx]
//         bandit.apply_updates(user_id, cluster, &context, idx, reward, cluster_scores[idx], final_scores[idx]);
//         // update user personal cluster
//         let adj = bandit.user_adjustments.get(user_id).unwrap();
//         assert!(adj[idx] != 0.0);
//     }

//     #[test]
//     fn simulate_maya_round_loss() {
//         let mut bandit = PersonalizedBandit::new();
//         let user_id = "maya";
//         let win_rate = 0.85;
//         let streak_norm = 1.0;
//         let speed_norm = 0.91;
//         let freq_norm = 1.0;

//         let cluster = bandit.classify_user(win_rate, 30.0);
//         let context = bandit.build_context(win_rate, streak_norm, speed_norm, freq_norm);

//         let (cluster_scores, final_scores, idx) = bandit.predict_and_select(user_id, cluster, &context);
//         let chosen_diff = DIFFICULTIES[idx] as f32;

//         let user_swipes = 31.0;
//         let won = false;
//         let reward = bandit.compute_reward(won, user_swipes, chosen_diff);

//         bandit.apply_updates(user_id, cluster, &context, idx, reward, cluster_scores[idx], final_scores[idx]);

//         let adj = bandit.user_adjustments.get(user_id).unwrap();
//         assert!(adj[idx] != 0.0);
//     }
// }

// fn main() {
//     let mut bandit = PersonalizedBandit::new();

//     // Debug: print cluster matrices before
//     println!("--- Initial cluster matrices ---");
//     for (cl, cm) in &bandit.clusters {
//         println!("Cluster {:?}: {:#?}", cl, cm.weights);
//     }

//     // Example: Alex
//     let user_id = "alex";
//     let win_rate = 0.25;
//     let context = bandit.build_context(win_rate, 0.1, 0.43, 0.29);
//     let cluster = bandit.classify_user(win_rate, 1.0);
//     let (cluster_scores, final_scores, idx) = bandit.predict_and_select(user_id, cluster, &context);
//     let chosen_difficulty = DIFFICULTIES[idx];
//     println!("Selected difficulty for {} -> {} (idx={})", user_id, chosen_difficulty, idx);

//     let reward = bandit.compute_reward(true, 12.0, chosen_difficulty as f32);
//     println!("Reward computed: {:.3}", reward);
//     bandit.apply_updates(user_id, cluster, &context, idx, reward, cluster_scores[idx], final_scores[idx]);

//     // Example: Maya
//     let user_id2 = "maya";
//     let win_rate2 = 0.85;
//     let context2 = bandit.build_context(win_rate2, 1.0, 0.91, 1.0);
//     let cluster2 = bandit.classify_user(win_rate2, 30.0);
//     let (cluster_scores2, final_scores2, idx2) = bandit.predict_and_select(user_id2, cluster2, &context2);
//     let chosen_difficulty2 = DIFFICULTIES[idx2];
//     println!("Selected difficulty for {} -> {} (idx={})", user_id2, chosen_difficulty2, idx2);

//     let reward2 = bandit.compute_reward(false, 31.0, chosen_difficulty2 as f32);
//     println!("Reward computed for {}: {:.3}", user_id2, reward2);
//     bandit.apply_updates(user_id2, cluster2, &context2, idx2, reward2, cluster_scores2[idx2], final_scores2[idx2]);

//     // Final debug: print cluster matrices after
// println!("--- Final cluster matrices ---");
// for (cl, cm) in &bandit.clusters {
//     println!("Cluster {:?}: {:#?}", cl, cm.weights);
// }

// println!("Done sample run.");

// }
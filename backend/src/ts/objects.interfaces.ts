export interface IUserData {
  username: string;
  tonAddress: string;
  kaiaAddress: string;
  isPremium: boolean;
  avatarUrl: string | null;
  directReferralCount: number;
  premiumReferralCount: number;
  referralCode: string;
  showFinishRwrd: boolean;
  isEligibleToClaim: boolean;
  streak: {
    isStreakActive: boolean;
    streakCount: number;
    lastMythClaimed: string | null;
  };
  joiningBonus: boolean;
  stakeOn: string | null;
  stakeReward: number;
  country: string;
  holdings: {
    stars: number;
    usdt: number;
    kaia: number;
  };
  isOneWaveUser?: boolean;
}

import mongoose, { Document } from "mongoose";

// notification
export interface INotification extends Document {
  title: string;
  description: string;
  category: string;
  status: boolean;
  redirect?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// quest
export interface IQuest extends Document {
  questName: string;
  description: string;
  type: string;
  link?: string[];
  mythology: "Celtic" | "Egyptian" | "Greek" | "Norse" | "Other";
  status: "Active" | "Inactive";
  requiredOrbs: Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
}

// partner
export interface IPartner extends Document {
  name: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: boolean;
  brandName: string;
  isCharity?: boolean;
  metadata: {
    brandName: string;
    howToRedeem: string;
    brandCategory: string;
    campaignTitle: string;
    campaignDetails: string;
    campaignSubTitle: string;
    expiryOfTheCoupon: Date;
    campaignCoverImage: string;
    termsAndConditions: string;
    brandRedirectionLink?: string;
    campaignAssets: {
      bannerView: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// rewards
export interface IReward extends Document {
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: boolean;
  paymentType: ("KAIA" | "USDT" | "ICP" | "BEGODS" | "BNB")[];
  amount: number;
  redirect?: string;
  limit: number;
  game: string;
  createdAt?: Date;
  updatedAt?: Date;
}

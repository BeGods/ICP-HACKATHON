import { Schema, model } from "mongoose";

const partnerSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    brandName: { type: String, required: true },
    isCharity: { type: Boolean },
    metadata: {
      brandName: { type: String, required: true },
      howToRedeem: { type: String, required: true },
      brandCategory: { type: String, required: true },
      campaignTitle: { type: String, required: true },
      campaignDetails: { type: String, required: true },
      campaignSubTitle: { type: String, required: true },
      expiryOfTheCoupon: { type: Date, required: true },
      campaignCoverImage: { type: String, required: true },
      termsAndConditions: { type: String, required: true },
      brandRedirectionLink: { type: String },
      campaignAssets: {
        bannerView: { type: String, required: true },
      },
    },
  },
  { timestamps: true }
);

const partners = model("Partners", partnerSchema);

export default partners;

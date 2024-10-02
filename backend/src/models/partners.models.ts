import { Schema, model, Document } from "mongoose";

const partnerSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    brandName: {
      type: String,
    },
    metadata: {
      brandName: {
        type: String,
      },
      campaignTitle: {
        type: String,
      },
      campaignSubTitle: {
        type: String,
      },
      campaignDetails: {
        type: String,
      },
      redirect: {
        type: String,
      },
      brandRedirectionLink: {
        type: String,
      },
      brandCategory: {
        type: String,
      },
      termsAndConditions: {
        type: String,
      },
      howToRedeem: {
        type: String,
      },
      expiryOfCoupon: {
        type: Date,
      },
      logo: {
        type: String,
      },
      campaignCoverImage: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const partners = model("Partners", partnerSchema);

export default partners;

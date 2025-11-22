import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaign extends Document {
  title: string;
  notes?: string;
  userId: string;
  createdAt: Date;
}

const campaignSchema = new Schema<ICampaign>({
  title: { type: String, required: true },
  notes: { type: String },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", campaignSchema);

export default Campaign;

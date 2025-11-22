import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaignMonster extends Document {
  campaignId: string;
  monsterId: string;
  createdAt: Date;
}

const campaignMonsterSchema = new Schema<ICampaignMonster>({
  campaignId: { type: String, required: true },
  monsterId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CampaignMonster: Model<ICampaignMonster> =
  mongoose.models.CampaignMonster ||
  mongoose.model<ICampaignMonster>("CampaignMonster", campaignMonsterSchema);

export default CampaignMonster;

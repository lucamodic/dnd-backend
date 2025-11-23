import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInitiativeTrack extends Document {
  title: string;
  description?: string;
  isActive: boolean;
  campaignId: string;
  createdAt: Date;
}

const initiativeTrackSchema = new Schema<IInitiativeTrack>({
  title: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  campaignId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const InitiativeTrack: Model<IInitiativeTrack> =
  mongoose.models.InitiativeTrack ||
  mongoose.model<IInitiativeTrack>("InitiativeTrack", initiativeTrackSchema);

export default InitiativeTrack;

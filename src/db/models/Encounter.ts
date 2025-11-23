import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEncounter extends Document {
  trackId: string;
  name: string;
  round: number;
  status: string;
  notes?: string;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const encounterSchema = new Schema<IEncounter>({
  trackId: { type: String, required: true },
  name: { type: String, required: true },
  round: { type: Number, default: 1 },
  status: { type: String, default: "draft" },
  notes: { type: String },
  startedAt: { type: Date },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Encounter: Model<IEncounter> =
  mongoose.models.Encounter ||
  mongoose.model<IEncounter>("Encounter", encounterSchema);

export default Encounter;

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICharacter extends Document {
  name: string;
  player?: string;
  pdf?: string;
  ac?: number;
  hp?: number;
  pp?: number;
  level?: number;
  notes?: string;
  campaignId?: string;
  playerId?: string;
  createdAt: Date;
  classId?: string;
}

const characterSchema = new Schema<ICharacter>({
  name: { type: String, required: true },
  player: { type: String },
  pdf: { type: String },
  ac: { type: Number },
  hp: { type: Number },
  pp: { type: Number },
  level: { type: Number },
  notes: { type: String },
  campaignId: { type: String },
  playerId: { type: String },
  createdAt: { type: Date, default: Date.now },
  classId: { type: String },
});

const Character: Model<ICharacter> =
  mongoose.models.Character ||
  mongoose.model<ICharacter>("Character", characterSchema);

export default Character;

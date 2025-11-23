import mongoose, { Schema, Document, Model } from "mongoose";

export type ParticipantType = "character" | "monster" | "custom";

export interface IEncounterParticipant extends Document {
  encounterId: string;
  participantType: ParticipantType;
  name: string;
  characterId?: string;
  monsterId?: string;
  campaignMonsterId?: string;
  initiative: number;
  hpCurrent?: number;
  hpMax?: number;
  armorClass?: number;
  isActive: boolean;
  sortOrder?: number;
  notes?: string;
  createdAt: Date;
}

const encounterParticipantSchema = new Schema<IEncounterParticipant>({
  encounterId: { type: String, required: true },
  participantType: {
    type: String,
    enum: ["character", "monster", "custom"],
    required: true,
  },
  name: { type: String, required: true },
  characterId: { type: String },
  monsterId: { type: String },
  campaignMonsterId: { type: String },
  initiative: { type: Number, default: 0 },
  hpCurrent: { type: Number },
  hpMax: { type: Number },
  armorClass: { type: Number },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const EncounterParticipant: Model<IEncounterParticipant> =
  mongoose.models.EncounterParticipant ||
  mongoose.model<IEncounterParticipant>(
    "EncounterParticipant",
    encounterParticipantSchema
  );

export default EncounterParticipant;

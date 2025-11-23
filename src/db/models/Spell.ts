import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpell extends Document {
  index: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  components: string[];
  material?: string;
  concentration: boolean;
  ritual: boolean;
  description: string[];
  higherLevel?: string[];
  createdAt: Date;
}

const spellSchema = new Schema<ISpell>({
  index: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, required: true },
  school: { type: String, required: true },
  castingTime: { type: String, required: true },
  range: { type: String, required: true },
  duration: { type: String, required: true },
  components: { type: [String], required: true },
  material: { type: String },
  concentration: { type: Boolean },
  ritual: { type: Boolean },
  description: { type: [String], required: true },
  higherLevel: { type: [String] },
  createdAt: { type: Date, default: Date.now },
});

const Spell: Model<ISpell> =
  mongoose.models.Spell || mongoose.model<ISpell>("Spell", spellSchema);

export default Spell;

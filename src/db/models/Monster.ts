import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMonster extends Document {
  index: string;
  name: string;
  size?: string;
  type?: string;
  alignment?: string;

  armor_class?: number;
  hit_points?: number;
  hit_dice?: string;
  speed?: any;

  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;

  proficiencies?: any;
  damage_vulnerabilities?: any;
  damage_resistances?: any;
  damage_immunities?: any;
  condition_immunities?: any;
  senses?: any;
  languages?: string;

  challenge_rating?: number;
  proficiency_bonus?: number;
  xp?: number;

  special_abilities?: any;
  actions?: any;
  legendary_actions?: any;
  reactions?: any;

  image?: string;
  userId?: string;
  createdAt: Date;
}

const monsterSchema = new Schema<IMonster>({
  index: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String },
  type: { type: String },
  alignment: { type: String },
  armor_class: { type: Number },
  hit_points: { type: Number },
  hit_dice: { type: String },
  speed: { type: Schema.Types.Mixed },
  strength: { type: Number },
  dexterity: { type: Number },
  constitution: { type: Number },
  intelligence: { type: Number },
  wisdom: { type: Number },
  charisma: { type: Number },
  proficiencies: { type: Schema.Types.Mixed },
  damage_vulnerabilities: { type: Schema.Types.Mixed },
  damage_resistances: { type: Schema.Types.Mixed },
  damage_immunities: { type: Schema.Types.Mixed },
  condition_immunities: { type: Schema.Types.Mixed },
  senses: { type: Schema.Types.Mixed },
  languages: { type: String },
  challenge_rating: { type: Number },
  proficiency_bonus: { type: Number },
  xp: { type: Number },
  special_abilities: { type: Schema.Types.Mixed },
  actions: { type: Schema.Types.Mixed },
  legendary_actions: { type: Schema.Types.Mixed },
  reactions: { type: Schema.Types.Mixed },
  image: { type: String },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Monster: Model<IMonster> =
  mongoose.models.Monster || mongoose.model<IMonster>("Monster", monsterSchema);

export default Monster;

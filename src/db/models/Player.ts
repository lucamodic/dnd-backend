import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  createdAt: Date;
}

const playerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Player: Model<IPlayer> =
  mongoose.models.Player || mongoose.model<IPlayer>("Player", playerSchema);

export default Player;

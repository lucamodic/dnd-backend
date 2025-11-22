import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClass extends Document {
  name: string;
  color?: string;
  image?: string;
  createdAt: Date;
}

const classSchema = new Schema<IClass>({
  name: { type: String, required: true },
  color: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Class: Model<IClass> =
  mongoose.models.Class || mongoose.model<IClass>("Class", classSchema);

export default Class;

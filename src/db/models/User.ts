import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username?: string;
  password?: string;
  refreshToken?: string;
  role?: string;
  createdAt: Date;
}

const userSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

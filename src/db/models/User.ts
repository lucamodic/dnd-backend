import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  id?: string;
  username?: string;
  email?: string;
  email_verified?: boolean;
  email_verification_token?: string | null;
  email_verification_expires_at?: Date | string | null;
  password?: string;
  refreshToken?: string;
  refresh_token?: string;
  role?: string;
  language?: string;
  locale?: string;
  createdAt: Date;
  created_at?: string;
}

const userSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  email_verification_token: {
    type: String,
  },
  email_verification_expires_at: {
    type: Date,
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
  language: {
    type: String,
  },
  locale: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

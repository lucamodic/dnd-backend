import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  username?: string;
  password?: string;
  refreshToken?: string;
}

const adminSchema: Schema = new Schema<IAdmin>({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
})

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;

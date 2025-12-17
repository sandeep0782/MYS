// models/Brand.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  description?: string;
  logo?: string;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
  },
  { timestamps: true }
);

const Brand =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", brandSchema);

export default Brand;

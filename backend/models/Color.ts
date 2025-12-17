import mongoose, { Schema, Document } from "mongoose";

export interface IColor extends Document {
  name: string;
  hexCode?: string;
}

const colorSchema = new Schema<IColor>({
  name: { type: String, required: true },
  hexCode: { type: String },
});

const Color =
  mongoose.models.Color || mongoose.model<IColor>("Color", colorSchema);
export default Color;

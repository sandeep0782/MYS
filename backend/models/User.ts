import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUSER extends Document {
  _id: mongoose.Types.ObjectId; // Add this line
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  profilePicture?: string | null;
  phoneNumber?: string | null;
  isVerified: boolean | null;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  agreeTerms: boolean;
  addresses: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUSER>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    profilePicture: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    agreeTerms: { type: Boolean, required: true },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUSER>("User", userSchema);
export default User;

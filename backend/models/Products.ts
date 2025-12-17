import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  slug?: string;
  price: number;
  finalPrice: number;
  stock?: number;
  stockStatus?: "in-stock" | "out-of-stock" | "preorder";
  backorder?: boolean;
  sizes?: {
    size: string;
    stock: number;
  }[];
  colors: mongoose.Types.ObjectId;
  images?: string[];
  video?: string;
  category?: mongoose.Types.ObjectId;
  tags?: string[];
  brand: mongoose.Types.ObjectId;
  collections?: mongoose.Types.ObjectId[];
  ratings?: number;
  reviews?: mongoose.Types.ObjectId[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  material?: string;
  careInstructions?: string;
  gender?: "Men" | "Women" | "Unisex" | "Boys" | "Girls";
  season?: string;
  shippingCharges: string; // e.g., "free" or "50"

  seller?: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    shortDescription: { type: String },
    sku: { type: String, unique: true },
    slug: { type: String, unique: true },
    price: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 1 },
    stockStatus: {
      type: String,
      enum: ["in-stock", "out-of-stock", "preorder"],
      default: "in-stock",
    },
    backorder: { type: Boolean, default: false },
    // sizes: [{ type: String }],
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    colors: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    images: [{ type: String, required: true }],
    video: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [{ type: String }],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    ratings: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    material: { type: String },
    careInstructions: { type: String },
    gender: { type: String, enum: ["Men", "Women", "Unisex", "Boys", "Girls"] },
    season: { type: String },
    shippingCharges: { type: String, default: "free" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;

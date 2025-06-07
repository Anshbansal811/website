import mongoose from "mongoose";

export interface IProductVariation extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  color: string;
  mrp: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productVariationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  mrp: {
    type: Number,
    required: false
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productVariationSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const ProductVariation = mongoose.model<IProductVariation>(
  "ProductVariation",
  productVariationSchema
);

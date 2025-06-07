import mongoose from "mongoose";

export enum ImageType {
  FRONT = "front",
  BACK = "back",
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
  DETAIL = "detail",
  OTHER = "other",
}

export interface IProductImage extends mongoose.Document {
  variationId: mongoose.Types.ObjectId;
  frontImage: string;
  backImage: string;
  leftImage: string;
  rightImage: string;
  topImage: string;
  bottomImage: string;
  detailImages: string[];
  otherImages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new mongoose.Schema({
  variationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariation",
    required: true,
  },
  frontImage: {
    type: String,
    required: true,
  },
  backImage: {
    type: String,
    required: true,
  },
  leftImage: {
    type: String,
    required: false,
  },
  rightImage: {
    type: String,
    required: false,
  },
  topImage: {
    type: String,
    required: false,
  },
  bottomImage: {
    type: String,
    required: false,
  },
  detailImages: [
    {
      type: String,
      required: false,
    },
  ],
  otherImages: [
    {
      type: String,
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productImageSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const ProductImage = mongoose.model<IProductImage>(
  "ProductImage",
  productImageSchema
);

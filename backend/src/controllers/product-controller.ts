import { Request, Response } from "express";
import { Product } from "../models/product-model";
import { ProductVariation } from "../models/product-variation-model";
import { ProductImage } from "../models/product-image-model";
import { UserRole } from "../models/user-model";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file: Express.Multer.File) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url);
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const uploadProduct = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== UserRole.SELLER) {
      return res
        .status(403)
        .json({ message: "Only sellers can upload products" });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const {
      productName,
      productType,
      color,
      mrp,
      quantity,
      description,
      existingProductId,
    } = req.body;

    let product;

    if (existingProductId) {
      // Use existing product
      product = await Product.findById(existingProductId);
      if (!product) {
        return res.status(404).json({ message: "Existing product not found" });
      }
      // For existing products, name, type, and description are not updated
    } else {
      // Validate required fields for new product
      if (!productName || !productType || !color || !quantity || !description) {
        return res.status(400).json({
          message: "Missing required fields for new product",
          missing: {
            productName: !productName,
            productType: !productType,
            color: !color,
            quantity: !quantity,
            description: !description,
          },
        });
      }
      // Create new product
      product = new Product({
        name: productName,
        type: productType,
        description: description,
        sellerId: req.user.userId,
      });
      await product.save();
    }

    if (!files?.frontImage || !files?.backImage) {
      return res
        .status(400)
        .json({ message: "Front and back images are required" });
    }

    // Create product variation (always new for a given product)
    const variation = new ProductVariation({
      productId: product._id,
      color,
      mrp: mrp ? parseFloat(mrp) : 0,
      stock: parseInt(quantity),
    });

    await variation.save();

    // Upload images to Cloudinary
    const [frontImageUrl, backImageUrl] = await Promise.all([
      uploadToCloudinary(files.frontImage[0]),
      uploadToCloudinary(files.backImage[0]),
    ]);

    const leftImageUrl = files.leftImage
      ? await uploadToCloudinary(files.leftImage[0])
      : undefined;
    const rightImageUrl = files.rightImage
      ? await uploadToCloudinary(files.rightImage[0])
      : undefined;
    const topImageUrl = files.topImage
      ? await uploadToCloudinary(files.topImage[0])
      : undefined;
    const bottomImageUrl = files.bottomImage
      ? await uploadToCloudinary(files.bottomImage[0])
      : undefined;

    const detailImageUrls = files.detailImages
      ? await Promise.all(
          files.detailImages.map((file) => uploadToCloudinary(file))
        )
      : [];

    const otherImageUrls = files.otherImages
      ? await Promise.all(
          files.otherImages.map((file) => uploadToCloudinary(file))
        )
      : [];

    // Create product images
    const imageData = {
      variationId: variation._id,
      frontImage: frontImageUrl,
      backImage: backImageUrl,
      leftImage: leftImageUrl,
      rightImage: rightImageUrl,
      topImage: topImageUrl,
      bottomImage: bottomImageUrl,
      detailImages: detailImageUrls,
      otherImages: otherImageUrls,
    };

    const productImage = new ProductImage(imageData);
    await productImage.save();

    res.status(201).json({
      message: "Product uploaded successfully",
      product: {
        id: product._id,
        name: product.name,
        type: product.type,
        description: product.description,
        variation: {
          id: variation._id,
          color: variation.color,
          mrp: variation.mrp,
          stock: variation.stock,
        },
        images: {
          front: productImage.frontImage,
          back: productImage.backImage,
          left: productImage.leftImage,
          right: productImage.rightImage,
          top: productImage.topImage,
          bottom: productImage.bottomImage,
          details: productImage.detailImages,
          others: productImage.otherImages,
        },
      },
    });
  } catch (error: any) {
    console.error("Product upload error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductVariation.aggregate([
      {
        $lookup: {
          from: "products", // The collection name for Product model (usually lowercase and plural)
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $lookup: {
          from: "productimages", // The collection name for ProductImage model (usually lowercase and plural)
          localField: "_id", // ProductVariation's _id
          foreignField: "variationId",
          as: "imageDetails",
        },
      },
      {
        $unwind: "$imageDetails",
      },
      {
        $project: {
          _id: "$productDetails._id",
          name: "$productDetails.name",
          type: "$productDetails.type",
          description: "$productDetails.description",
          variation: {
            color: "$color",
            mrp: "$mrp",
            stock: "$stock",
          },
          images: {
            front: "$imageDetails.frontImage",
          },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: "variation",
        model: "ProductVariation",
      })
      .populate({
        path: "images",
        model: "ProductImage",
      });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error: any) {
    console.error("Error fetching product by ID:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const getExistingProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}, "_id name type"); // Fetch only _id, name, and type
    res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching existing products:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res.status(500).json({ message: "Failed to fetch existing products" });
  }
};

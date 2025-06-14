import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { uploadToCloudinary } from "../config/cloudinary";

const prisma = new PrismaClient();

export const uploadProduct = async (req: Request, res: Response) => {
  try {
    const {
      productName,
      productType,
      description,
      color,
      mrp,
      quantity,
      existingProductId,
      frontImage,
      backImage,
      leftImage,
      rightImage,
      topImage,
      bottomImage,
      detailImages,
      otherImages,
    } = req.body;

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      let productId = existingProductId;

      // Check if product with same name exists
      const existingProduct = await tx.product.findFirst({
        where: {
          name: productName,
          seller: {
            id: req.user?.userId,
          },
        },
      });

      if (existingProduct) {
        console.log("existingProduct");
        productId = existingProduct.id;
      } else {
        const newProduct = await tx.product.create({
          data: {
            name: productName,
            type: {
              connect: { name: productType },
            },
            seller: {
              connect: { id: req.user?.userId },
            },
            description,
          },
        });
        productId = newProduct.id;
      }

      // Create product variation
      const variation = await tx.productVariation.create({
        data: {
          productId,
          color: color,
          mrp: mrp ? parseFloat(mrp) : null,
          stock: parseInt(quantity),
        },
      });

      // Create product image record
      const productImage = await tx.productImage.create({
        data: {
          variationId: variation.id,
        },
      });

      // Helper function to create image records
      const createImageRecord = async (
        base64Data: string,
        imageTypeName: string
      ) => {
        const imageType = await tx.imageType.findFirst({
          where: {
            name: {
              equals: imageTypeName.toUpperCase(),
              mode: "insensitive",
            },
          },
        });

        if (!imageType) {
          throw new Error(`Invalid image type: ${imageTypeName}`);
        }

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(base64Data);

        return tx.image.create({
          data: {
            url: cloudinaryResult.url,
            publicId: cloudinaryResult.public_id,
            imageTypeId: imageType.id,
            productImageId: productImage.id,
          } as unknown as Prisma.ImageUncheckedCreateInput,
        });
      };

      // Create all image records
      const imagePromises = [];

      if (frontImage) {
        imagePromises.push(createImageRecord(frontImage, "front"));
      }
      if (backImage) {
        imagePromises.push(createImageRecord(backImage, "back"));
      }
      if (leftImage) {
        imagePromises.push(createImageRecord(leftImage, "left"));
      }
      if (rightImage) {
        imagePromises.push(createImageRecord(rightImage, "right"));
      }
      if (topImage) {
        imagePromises.push(createImageRecord(topImage, "top"));
      }
      if (bottomImage) {
        imagePromises.push(createImageRecord(bottomImage, "bottom"));
      }

      // Handle detail images
      if (detailImages && Array.isArray(detailImages)) {
        detailImages.forEach((image: string) => {
          imagePromises.push(createImageRecord(image, "detail"));
        });
      }

      // Handle other images
      if (otherImages && Array.isArray(otherImages)) {
        otherImages.forEach((image: string) => {
          imagePromises.push(createImageRecord(image, "other"));
        });
      }

      await Promise.all(imagePromises);

      return { productId, variationId: variation.id };
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error uploading product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload product",
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variations: {
          include: {
            images: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
    res.json({ success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        variations: {
          include: {
            images: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    res.json({ success: true, data: product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
};

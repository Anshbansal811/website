import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        type: true,
        variations: {
          include: {
            images: {
              include: {
                images: {
                  include: {
                    imageType: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Transform the data to match the frontend interface
    const transformedProducts = products
      .map((product) => {
        try {
          const transformed = {
            _id: product.id,
            name: product.name,
            type: product.type.name,
            description: product.description,
            variation: product.variations[0]
              ? {
                  color: product.variations[0].color,
                  mrp: product.variations[0].mrp || 0,
                  stock: product.variations[0].stock,
                }
              : {
                  color: "",
                  mrp: 0,
                  stock: 0,
                },
            images: product.variations[0]?.images[0]?.images.reduce(
              (acc: any, img) => {
                const type = img.imageType.name.toLowerCase();
                if (
                  type === "front" ||
                  type === "back" ||
                  type === "left" ||
                  type === "right" ||
                  type === "top" ||
                  type === "bottom"
                ) {
                  acc[type] = img.url;
                } else if (type === "detail") {
                  if (!acc.details) acc.details = [];
                  acc.details.push(img.url);
                } else {
                  if (!acc.others) acc.others = [];
                  acc.others.push(img.url);
                }
                return acc;
              },
              {
                front: "",
                back: "",
                details: [] as string[],
                others: [] as string[],
              }
            ) || {
              front: "",
              back: "",
              details: [] as string[],
              others: [] as string[],
            },
          };

          return transformed;
        } catch (error) {
          console.error("Error transforming product:", product.id, error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries from failed transformations


    if (!Array.isArray(transformedProducts)) {
      throw new Error("Transformed products is not an array");
    }

    res.json(transformedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

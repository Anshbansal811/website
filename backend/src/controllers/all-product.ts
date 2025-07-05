import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        type: {
          select: {
            name: true,
          },
        },
        variations: {
          select: {
            color: true,
            mrp: true,
            images: {
              select: {
                images: {
                  where: {
                    imageType: {
                      name: "FRONT",
                    },
                  },
                  select: {
                    url: true,
                    imageType: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        variations: {
          some: {
            images: {
              some: {
                images: {
                  some: {
                    imageType: {
                      name: "FRONT",
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!Array.isArray(products)) {
      throw new Error("Transformed products is not an array");
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllExistingProductName = async (
  req: Request,
  res: Response
) => {
  try {
    const existingProductName = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        type: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "desc",
      },
    });
    res.status(200).json({ existingProductName });
  } catch (error: any) {
    console.error("Error in getAllUsersHandler:", error);
    res.status(500).json({ message: error.message });
  }
};

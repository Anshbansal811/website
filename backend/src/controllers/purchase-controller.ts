import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const buyProduct = async (req: Request, res: Response) => {
  try {
    const { productId, place, state, city } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const userId = req.user.userId;
    const purchase = await prisma.purchase.create({
      data: { userId, productId, place, state, city },
    });
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: "Failed to complete purchase" });
  }
};

export const getPurchases = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const userId = req.user.userId;
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: { product: true },
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

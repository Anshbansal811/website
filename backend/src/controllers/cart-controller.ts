import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const userId = req.user.userId;
    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity || 1 } },
      create: { userId, productId, quantity: quantity || 1 },
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const userId = req.user.userId;
    const cart = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const userId = req.user.userId;
    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};

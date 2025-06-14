import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 50;
    const skip = (page - 1) * pageSize;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip: skip,
        take: pageSize,
      }),
      prisma.contact.count(),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    res.status(200).json({
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: pageSize,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Error in getAllUsersHandler:", error);
    res.status(500).json({ message: error.message });
  }
};

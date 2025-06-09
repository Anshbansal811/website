import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Example: P2002 is a unique constraint violation
    if (err.code === "P2002") {
      return res.status(400).json({
        message: `Unique constraint failed on the field: ${err.meta?.target}`,
      });
    }

    return res.status(400).json({ message: "Database error", code: err.code });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Invalid input data",
      detail: err.message,
    });
  }

  // Generic fallback
  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
}

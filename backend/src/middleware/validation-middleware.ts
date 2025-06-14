import { Request, Response, NextFunction } from "express";

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productName, productType } = req.body;

  if (!productName || !productType) {
    return res.status(400).json({
      success: false,
      message: "Product name and type are required",
    });
  }

  next();
};

export const validateAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  next();
};

export const validateContact = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, phonenumber, message } = req.body;

  if (!name || !email || !phonenumber || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, phone number, and message are required",
    });
  }

  next();
};

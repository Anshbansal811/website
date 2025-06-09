import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, company, phonenumber } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const phone = parseInt(phonenumber, 10);
    if (isNaN(phone)) {
      return res.status(400).json({ message: "Phone number must be a number" });
    }
    // Create new user

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        phonenumber: phone.toString(),
        role: {
          connect: { name: role.toUpperCase() }, // Assuming role is a string like "SELLER", "CORPORATE", etc.
        },
        company:
          role.toUpperCase() === "CORPORATE" || role.toUpperCase() === "SELLER"
            ? company
            : undefined,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.roleId }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.roleId,
        company: user.company,
        phonenumber: user.phonenumber,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await prisma.user.findUnique({
      where: { password: password },
    });
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.roleId }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.roleId,
        company: user.company,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    console.log("Request user:", req);
    /*const user = await prisma.user.findUnique({
      where: { id: req.user?.userId }, // optional chaining to avoid runtime crash
      include: { role: true }, // optional: if you want role.name or details
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
      },
    });*/
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

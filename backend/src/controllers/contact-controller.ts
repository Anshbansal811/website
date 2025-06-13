import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(req.body.phonenumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    const result = await prisma.contact.create({
      data: {
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        message: req.body.message,
        phonenumber: req.body.phonenumber,
        company: req.body.company,
        subject: req.body.subject || "",
        gstPan: req.body.gst_pan,
      },
    });

    // Use status 200 for successful form submission to match frontend expectations
    res.status(200).json({
      success: true,
      data: result,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return res.status(409).json({
          success: false,
          message: "A submission with these details already exists",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Error submitting contact form",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch contact" });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json({ success: true, data: contact });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update contact" });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    await prisma.contact.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete contact" });
  }
};

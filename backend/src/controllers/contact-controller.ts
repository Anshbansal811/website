import { Request, Response } from "express";
import { createUsers, ContactUsers } from "../models/contact-model";

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const submission: ContactUsers = req.body;

    // Validate required fields
    const requiredFields = [
      "name",
      "phonenumber",
      "subject",
      "message",
      "state",
      "city",
      "company",
    ];

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(submission.phonenumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    const result = await createUsers(submission);

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

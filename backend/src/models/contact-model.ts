import pool from "../config/db";

export interface ContactUsers {
  name: string;
  phonenumber: string;
  subject: string;
  message: string;
  state: string;
  city: string;
  company: string;
  gst_pan?: string;
}

export const createUsers = async (
  submission: ContactUsers
) => {
  const { name, phonenumber, subject, message, state, city, company, gst_pan } =
    submission;
    console.log("Received submission:", name, phonenumber, subject, message, state, city, company, gst_pan);

  const query = `
    INSERT INTO Users 
    (name, phonenumber, subject, message, state, city, company, gst_pan)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    name,
    phonenumber,
    subject,
    message,
    state,
    city,
    company,
    gst_pan,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

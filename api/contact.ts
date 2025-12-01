import { sql } from "@vercel/postgres";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Handle POST request
  if (request.method === "POST") {
    try {
      const { name, email, message } = request.body;

      // Validate input
      if (!name || !email || !message) {
        return response.status(400).json({
          error: "Please provide name, email, and message",
        });
      }

      // Insert into database
      const result = await sql`
        INSERT INTO contacts (name, email, message, created_at)
        VALUES (${name}, ${email}, ${message}, NOW())
        RETURNING id, name, email, message, created_at;
      `;

      return response.status(200).json({
        success: true,
        message: "Contact form submitted successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Database error:", error);
      return response.status(500).json({
        error: "Failed to submit contact form",
      });
    }
  }

  // Handle GET request - retrieve all contacts
  if (request.method === "GET") {
    try {
      const result = await sql`
        SELECT id, name, email, message, created_at
        FROM contacts
        ORDER BY created_at DESC;
      `;

      return response.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      console.error("Database error:", error);
      return response.status(500).json({
        error: "Failed to retrieve contacts",
      });
    }
  }

  return response.status(405).json({ error: "Method not allowed" });
}

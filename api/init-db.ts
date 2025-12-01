import { sql } from "@vercel/postgres";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Create table if it doesn't exist
    const result = await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return response.status(200).json({
      success: true,
      message: "Database table initialized successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return response.status(500).json({
      error: "Failed to initialize database",
    });
  }
}

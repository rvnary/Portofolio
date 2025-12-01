import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Enable CORS
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (request.method === "OPTIONS") {
    response.status(200).end();
    return;
  }

  try {
    // Try both env variable names for compatibility
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing env vars:", {
        url: !!supabaseUrl,
        key: !!supabaseKey,
      });
      return response.status(500).json({
        error: "Missing Supabase environment variables",
        debug: "SUPABASE_URL or SUPABASE_ANON_KEY not set",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    if (request.method === "POST") {
      const { name, email, message } = request.body;

      // Validate required fields
      if (!name || !email || !message) {
        return response.status(400).json({
          error: "Missing required fields: name, email, message",
        });
      }

      // Insert data into contacts table
      const { data, error } = await supabase
        .from("contacts")
        .insert([
          {
            name: String(name).trim(),
            email: String(email).trim(),
            message: String(message).trim(),
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        return response.status(500).json({
          error: "Failed to save contact message",
          details: error.message,
        });
      }

      return response.status(201).json({
        success: true,
        message: "Contact message saved successfully",
        data,
      });
    } else if (request.method === "GET") {
      // Retrieve all contacts
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase select error:", error);
        return response.status(500).json({
          error: "Failed to retrieve contact messages",
        });
      }

      return response.status(200).json({
        success: true,
        data,
      });
    } else {
      return response.status(405).json({
        error: "Method not allowed",
      });
    }
  } catch (error) {
    console.error("API error:", error);
    return response.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

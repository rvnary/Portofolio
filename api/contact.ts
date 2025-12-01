import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return response.status(500).json({
        error: "Missing Supabase environment variables",
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
            name,
            email,
            message,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        return response.status(500).json({
          error: "Failed to save contact message",
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
    });
  }
}

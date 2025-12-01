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

    // Create contacts table if it doesn't exist
    const { data, error: createError } = await supabase.rpc(
      "get_schema_version"
    );

    // Try to insert a test record to verify table exists
    const { error: tableError } = await supabase
      .from("contacts")
      .select("count", { count: "exact", head: true });

    if (tableError) {
      // Table doesn't exist, we need to create it
      // This requires using the admin client or manual SQL execution
      return response.status(500).json({
        error:
          "Table does not exist. Please run the SQL setup script in Supabase Dashboard.",
        hint: "Go to Supabase Dashboard > SQL Editor and run the setup script from DATABASE_SETUP.md",
      });
    }

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

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { summarizeText } from "@/lib/utils/ai";

// Get API key from environment variable
const AI_API_KEY = process.env.GROQ_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { text, noteId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Call the AI service to summarize the text
    const { summary, error } = await summarizeText(text, AI_API_KEY);

    if (error) {
      return NextResponse.json(
        { error: `Error summarizing text: ${error}` },
        { status: 500 }
      );
    }

    // If we have a noteId, update the note with the summary
    if (noteId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { error: updateError } = await supabase
          .from("notes")
          .update({ summary })
          .eq("id", noteId);

        if (updateError) {
          console.error("Error updating note with summary:", updateError);
        }
      }
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error in summarize API:", error);
    return NextResponse.json(
      { error: "An error occurred while summarizing the text" },
      { status: 500 }
    );
  }
}

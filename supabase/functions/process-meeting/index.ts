import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ZAI_BASE_URL = "https://api.z.ai/api/paas/v4";

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { transcript } = await req.json();
    if (!transcript || typeof transcript !== "string") {
      return new Response(
        JSON.stringify({ error: "transcript is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ZAI_API_KEY = Deno.env.get("ZAI_API_KEY");
    if (!ZAI_API_KEY) throw new Error("ZAI_API_KEY not configured");

    // Debug: log key format (first 8 chars only)
    console.log("ZAI key prefix:", ZAI_API_KEY.substring(0, 8), "length:", ZAI_API_KEY.length);
    console.log("Calling:", `${ZAI_BASE_URL}/chat/completions`);

    const response = await fetch(
      `${ZAI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ZAI_API_KEY}`,
          "Content-Type": "application/json",
          "Accept-Language": "en-US,en",
        },
        body: JSON.stringify({
          model: "glm-4.5",
          messages: [
            {
              role: "system",
              content: `You are an expert meeting analyst. Return a JSON object with: "summary" (string), "keyPoints" (array of strings), "participants" (array of strings), "actions" (array of objects with title, owner, deadline, priority).`,
            },
            { role: "user", content: `Analyze this meeting transcript:\n\n${transcript}` },
          ],
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("Z.AI API error:", status, text);
      throw new Error(`Z.AI API error: ${status} - ${text}`);
    }

    const data = await response.json();
    console.log("Z.AI response received, choices:", data.choices?.length);
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result;
    if (toolCall) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      const content = data.choices?.[0]?.message?.content || "{}";
      // Try to extract JSON from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("process-meeting error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

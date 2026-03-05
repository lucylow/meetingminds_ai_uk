import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ZAI_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";

async function generateZaiToken(apiKey: string): Promise<string> {
  const [id, secret] = apiKey.split(".");
  if (!id || !secret) throw new Error("Invalid ZAI_API_KEY format");

  const now = Date.now();
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );

  return await create(
    { alg: "HS256", typ: "JWT", sign_type: "SIGN" },
    { api_key: id, exp: Math.floor(now / 1000) + 3600, timestamp: now },
    cryptoKey
  );
}

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

    const token = await generateZaiToken(ZAI_API_KEY);

    const response = await fetch(
      `${ZAI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "glm-4-flash",
          messages: [
            {
              role: "system",
              content: `You are an expert meeting analyst. Analyze the transcript and return structured JSON with:
- "summary": concise executive summary (2-3 sentences)
- "keyPoints": array of 3-7 key discussion points (short bullet strings)
- "participants": array of participant names
- "actions": array of action items, each with "title" (string), "owner" (string), "deadline" (string), "priority" ("high"|"medium"|"low")

Return ONLY valid JSON, no markdown fences.`,
            },
            { role: "user", content: `Analyze this meeting transcript:\n\n${transcript}` },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "meeting_analysis",
                description: "Return structured meeting analysis",
                parameters: {
                  type: "object",
                  properties: {
                    summary: { type: "string" },
                    keyPoints: { type: "array", items: { type: "string" } },
                    participants: { type: "array", items: { type: "string" } },
                    actions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          owner: { type: "string" },
                          deadline: { type: "string" },
                          priority: { type: "string", enum: ["high", "medium", "low"] },
                        },
                        required: ["title", "owner", "deadline", "priority"],
                      },
                    },
                  },
                  required: ["summary", "keyPoints", "participants", "actions"],
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "meeting_analysis" } },
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      const text = await response.text();
      console.error("Z.AI API error:", status, text);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Z.AI API error: ${status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result;
    if (toolCall) {
      result = JSON.parse(toolCall.function.arguments);
    } else {
      const content = data.choices?.[0]?.message?.content || "{}";
      result = JSON.parse(content.replace(/```json?\n?/g, "").replace(/```/g, ""));
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

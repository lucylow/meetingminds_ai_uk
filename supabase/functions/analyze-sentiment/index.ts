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
          model: "glm-4.7-flash",
          messages: [
            {
              role: "system",
              content: `You are a sentiment and tone analyst for meetings. Analyze the transcript and return structured JSON with:
- "overall": overall sentiment ("positive"|"neutral"|"negative"|"mixed")
- "score": sentiment score from -1.0 (very negative) to 1.0 (very positive)
- "highlights": array of objects with "speaker" (string), "sentiment" ("positive"|"neutral"|"negative"), "quote" (short excerpt), "reason" (brief explanation)
- "topics": array of objects with "topic" (string), "sentiment" ("positive"|"neutral"|"negative"), "intensity" (1-5)
- "recommendations": array of 2-3 actionable suggestions based on the meeting tone

Return ONLY valid JSON, no markdown fences.`,
            },
            { role: "user", content: `Analyze the sentiment of this meeting transcript:\n\n${transcript}` },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "sentiment_analysis",
                description: "Return structured sentiment analysis of a meeting",
                parameters: {
                  type: "object",
                  properties: {
                    overall: { type: "string", enum: ["positive", "neutral", "negative", "mixed"] },
                    score: { type: "number" },
                    highlights: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          speaker: { type: "string" },
                          sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                          quote: { type: "string" },
                          reason: { type: "string" },
                        },
                        required: ["speaker", "sentiment", "quote", "reason"],
                      },
                    },
                    topics: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          topic: { type: "string" },
                          sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                          intensity: { type: "number" },
                        },
                        required: ["topic", "sentiment", "intensity"],
                      },
                    },
                    recommendations: { type: "array", items: { type: "string" } },
                  },
                  required: ["overall", "score", "highlights", "topics", "recommendations"],
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "sentiment_analysis" } },
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
    console.error("analyze-sentiment error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

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
    const { transcript, question } = await req.json();
    if (!transcript || !question) {
      return new Response(
        JSON.stringify({ error: "transcript and question are required" }),
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
              content: `You are a meeting assistant. Answer questions about the meeting transcript accurately and concisely. Cite specific details from the transcript. If the answer isn't in the transcript, say so. Keep answers to 2-3 sentences.`,
            },
            {
              role: "user",
              content: `Meeting Transcript:\n${transcript}\n\nQuestion: ${question}`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      await response.text();
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Z.AI API error: ${status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Unable to answer.";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("meeting-qa error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

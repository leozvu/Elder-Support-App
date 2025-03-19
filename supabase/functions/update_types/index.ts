// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/examples/supabase-functions

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Get the project ID and service key from environment variables
    const projectId = Deno.env.get("SUPABASE_PROJECT_ID");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_KEY");

    if (!projectId || !serviceKey) {
      throw new Error("Missing environment variables");
    }

    // Generate types using the Supabase CLI
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectId}/types/typescript`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to generate types: ${response.statusText}`);
    }

    const types = await response.text();

    return new Response(JSON.stringify({ types }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
});

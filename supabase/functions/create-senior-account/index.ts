// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/examples/supabase-functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get request body
    const {
      email,
      password = "password123",
      fullName = "Senior User",
    } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Create a Supabase client with the Auth admin API key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables for Supabase connection");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create the user in auth.users using the admin API
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: "customer",
        },
        app_metadata: {
          role: "customer",
        },
      });

    if (authError) {
      throw new Error(`Error creating auth user: ${authError.message}`);
    }

    const userId = authUser.user.id;

    // Create the user profile in public.users
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: userId,
        email: email,
        full_name: fullName,
        role: "customer",
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      },
    ]);

    if (profileError) {
      throw new Error(`Error creating user profile: ${profileError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Senior account created successfully",
        user: {
          id: userId,
          email: email,
          role: "customer",
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});

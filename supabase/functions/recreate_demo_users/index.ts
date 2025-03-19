// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/examples/supabase-functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DemoUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: "customer" | "helper" | "admin";
  phone: string;
  address: string;
  avatar_url: string;
}

const demoUsers: DemoUser[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "martha@example.com",
    password: "password123",
    full_name: "Martha Johnson",
    role: "customer",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "helper@example.com",
    password: "password123",
    full_name: "Henry Helper",
    role: "helper",
    phone: "(555) 987-6543",
    address: "456 Oak St, Anytown, USA",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    email: "admin@example.com",
    password: "password123",
    full_name: "Admin User",
    role: "admin",
    phone: "(555) 555-5555",
    address: "789 Pine St, Anytown, USA",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  },
];

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth admin API key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables for Supabase connection");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // First, delete existing demo users if they exist
    for (const user of demoUsers) {
      // Check if user exists in auth.users
      const { data: existingAuthUser } = await supabase.auth.admin.getUserById(
        user.id,
      );

      if (existingAuthUser?.user) {
        // Delete the user from auth.users
        await supabase.auth.admin.deleteUser(user.id);
      }

      // Delete from public.users if exists (will cascade to helper_profiles)
      await supabase.from("users").delete().eq("id", user.id);
    }

    // Wait a moment to ensure deletions are processed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Now create the demo users
    const results = [];

    for (const user of demoUsers) {
      // Create the user in auth.users
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.full_name,
            role: user.role,
          },
          app_metadata: {
            role: user.role,
          },
          // Use the predefined UUID
          id: user.id,
        });

      if (authError) {
        results.push({
          user: user.email,
          success: false,
          error: authError.message,
        });
        continue;
      }

      // Create the user profile in public.users
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          address: user.address,
          role: user.role,
          avatar_url: user.avatar_url,
        },
      ]);

      if (profileError) {
        results.push({
          user: user.email,
          success: false,
          error: profileError.message,
        });
        continue;
      }

      // If user is a helper, create helper profile
      if (user.role === "helper") {
        const { error: helperError } = await supabase
          .from("helper_profiles")
          .insert([
            {
              id: user.id,
              bio: "Experienced helper with a passion for assisting seniors.",
              verification_status: "approved",
              services_offered: [
                "Shopping Assistance",
                "Medical Appointments",
                "Companionship",
                "Home Maintenance",
              ],
              average_rating: 4.8,
              total_reviews: 24,
            },
          ]);

        if (helperError) {
          results.push({
            user: user.email,
            success: true,
            profile: true,
            helper_profile: false,
            error: helperError.message,
          });
          continue;
        }
      }

      results.push({
        user: user.email,
        success: true,
        profile: true,
        helper_profile: user.role === "helper" ? true : "n/a",
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
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

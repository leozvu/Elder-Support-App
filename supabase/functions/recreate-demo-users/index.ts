// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/examples/supabase-functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DemoUser {
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
    email: "martha@example.com",
    password: "password123",
    full_name: "Martha Johnson",
    role: "customer",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martha",
  },
  {
    email: "helper@example.com",
    password: "password123",
    full_name: "Henry Helper",
    role: "helper",
    phone: "(555) 987-6543",
    address: "456 Oak St, Anytown, USA",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
  },
  {
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

    // First, delete existing users with the same emails if they exist
    const results = [];

    // Try to delete existing users from auth.users
    for (const user of demoUsers) {
      try {
        // Find users with the same email in auth.users
        const { data: authUsers, error: findAuthError } =
          await supabase.auth.admin.listUsers();

        if (findAuthError) {
          results.push({
            user: user.email,
            action: "find_auth_users",
            success: false,
            error: findAuthError.message,
          });
          continue;
        }

        // Find the user with matching email
        const matchingAuthUser = authUsers.users.find(
          (u) => u.email === user.email,
        );

        if (matchingAuthUser) {
          // Delete the user from auth.users
          const { error: authDeleteError } =
            await supabase.auth.admin.deleteUser(matchingAuthUser.id);

          if (authDeleteError) {
            results.push({
              user: user.email,
              action: "delete_auth",
              success: false,
              error: authDeleteError.message,
            });
          } else {
            results.push({
              user: user.email,
              action: "delete_auth",
              success: true,
            });
          }
        }

        // Find users with the same email in public.users
        const { data: existingUsers, error: findError } = await supabase
          .from("users")
          .select("id, email")
          .eq("email", user.email);

        if (findError) {
          results.push({
            user: user.email,
            action: "find_users",
            success: false,
            error: findError.message,
          });
          continue;
        }

        // If users with this email exist in public.users, delete them
        if (existingUsers && existingUsers.length > 0) {
          for (const existingUser of existingUsers) {
            // Delete from public.users (this will cascade to helper_profiles)
            const { error: userDeleteError } = await supabase
              .from("users")
              .delete()
              .eq("id", existingUser.id);

            if (userDeleteError) {
              results.push({
                user: existingUser.email,
                action: "delete_user",
                success: false,
                error: userDeleteError.message,
              });
            } else {
              results.push({
                user: existingUser.email,
                action: "delete_user",
                success: true,
              });
            }
          }
        }
      } catch (e) {
        results.push({
          user: user.email,
          action: "delete_exception",
          success: false,
          error: e.message,
        });
      }
    }

    // Wait a moment to ensure deletions are processed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Now create the demo users
    for (const user of demoUsers) {
      try {
        // Create the user in auth.users using the admin API
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
          });

        if (authError) {
          results.push({
            user: user.email,
            action: "create_auth",
            success: false,
            error: authError.message,
          });
          continue;
        }

        const userId = authUser.user.id;

        // Create the user profile in public.users
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: userId,
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
            action: "create_profile",
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
                id: userId,
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
              action: "create_helper_profile",
              success: false,
              error: helperError.message,
            });
            continue;
          }
        }

        results.push({
          user: user.email,
          action: "create_complete",
          success: true,
          userId: userId,
          role: user.role,
        });
      } catch (userError) {
        results.push({
          user: user.email,
          action: "create_exception",
          success: false,
          error: userError.message || "Unknown error",
        });
      }
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

import { supabase } from "./supabase";

// Demo user data
const demoUsers = [
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

/**
 * Ensures that demo users exist in the database
 * This function will check if the demo users exist and create them if they don't
 */
export async function ensureDemoUsers() {
  console.log("Checking for demo users...");

  try {
    // Try to use the edge function first
    try {
      console.log("Attempting to use edge function to create demo users");
      const { data, error } = await supabase.functions.invoke(
        "recreate-demo-users",
        {
          method: "POST",
          body: {},
        },
      );

      if (error) {
        console.error("Error calling recreate-demo-users function:", error);
      } else {
        console.log("Edge function response:", data);
        return true;
      }
    } catch (functionError) {
      console.error(
        "Exception calling recreate-demo-users function:",
        functionError,
      );
    }

    // Fall back to direct API if edge function fails
    console.log("Falling back to direct API for creating users");

    // Check if we have the service key available
    const serviceKey =
      import.meta.env.VITE_SUPABASE_SERVICE_KEY ||
      import.meta.env.SUPABASE_SERVICE_KEY;

    if (!serviceKey) {
      console.warn("No service key available, cannot ensure demo users");
      return false;
    }

    // Check if users exist in the public.users table
    const { data: existingUsers, error: queryError } = await supabase
      .from("users")
      .select("id, email")
      .in(
        "email",
        demoUsers.map((user) => user.email),
      );

    if (queryError) {
      console.error("Error checking for existing users:", queryError);
      return false;
    }

    console.log(`Found ${existingUsers?.length || 0} existing demo users`);

    // Create missing users
    const existingEmails = new Set(
      existingUsers?.map((user) => user.email) || [],
    );
    const missingUsers = demoUsers.filter(
      (user) => !existingEmails.has(user.email),
    );

    if (missingUsers.length === 0) {
      console.log("All demo users already exist");
      return true;
    }

    console.log(`Creating ${missingUsers.length} missing demo users...`);

    // Create each missing user
    for (const user of missingUsers) {
      console.log(`Creating user: ${user.email}`);

      // 1. Create the auth user using the Admin API
      const adminAuthUrl = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/admin/users`;
      const authResponse = await fetch(adminAuthUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
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
        }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        console.error(`Failed to create auth user ${user.email}:`, errorData);
        continue;
      }

      const authData = await authResponse.json();
      console.log(`Created auth user: ${user.email} with ID: ${authData.id}`);

      // 2. Create the user profile in the public.users table
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: authData.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          address: user.address,
          role: user.role,
          avatar_url: user.avatar_url,
        },
      ]);

      if (profileError) {
        console.error(
          `Error creating profile for ${user.email}:`,
          profileError,
        );
        continue;
      }

      console.log(`Created profile for ${user.email}`);

      // 3. If user is a helper, create helper profile
      if (user.role === "helper") {
        const { error: helperError } = await supabase
          .from("helper_profiles")
          .insert([
            {
              id: authData.id,
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
          console.error(
            `Error creating helper profile for ${user.email}:`,
            helperError,
          );
        } else {
          console.log(`Created helper profile for ${user.email}`);
        }
      }
    }

    console.log("Demo users creation completed");
    return true;
  } catch (error) {
    console.error("Error ensuring demo users:", error);
    return false;
  }
}

/**
 * Checks if demo users exist in the database
 * Returns the count of existing demo users
 */
export async function checkDemoUsers() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role")
      .in(
        "email",
        demoUsers.map((user) => user.email),
      );

    if (error) {
      console.error("Error checking demo users:", error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error("Exception checking demo users:", error);
    return 0;
  }
}

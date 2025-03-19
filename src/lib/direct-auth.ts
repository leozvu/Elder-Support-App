/**
 * Direct authentication with Supabase REST API
 * This bypasses the Supabase JS client to rule out any client-side issues
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase environment variables for direct auth");
}

interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
}

/**
 * Sign in directly using Supabase REST API
 */
export async function directSignIn(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    console.log(`Direct API login attempt for ${email}`);

    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const responseData = await response.json();
    console.log(`Direct auth response status: ${response.status}`);

    if (!response.ok) {
      console.error("Direct auth error:", responseData);
      return {
        success: false,
        error:
          responseData.error_description ||
          responseData.error ||
          "Authentication failed",
        statusCode: response.status,
        data: responseData,
      };
    }

    // Store the access token in localStorage
    localStorage.setItem(
      "supabase.auth.token",
      JSON.stringify({
        access_token: responseData.access_token,
        refresh_token: responseData.refresh_token,
        expires_at: Date.now() + responseData.expires_in * 1000,
      }),
    );

    console.log("Direct auth successful");
    return {
      success: true,
      data: responseData,
    };
  } catch (error: any) {
    console.error("Exception during direct auth:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

/**
 * Get user data using the access token
 */
export async function getUserData(accessToken: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    const userData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: userData.error || "Failed to get user data",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: userData,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

/**
 * Create a user directly using Supabase REST API
 */
export async function directCreateUser(
  email: string,
  password: string,
  userData: any,
): Promise<AuthResponse> {
  try {
    console.log(`Direct API signup attempt for ${email}`);

    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email,
        password,
        data: userData,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Direct signup error:", responseData);
      return {
        success: false,
        error:
          responseData.error_description ||
          responseData.error ||
          "Signup failed",
        statusCode: response.status,
        data: responseData,
      };
    }

    console.log("Direct signup successful");
    return {
      success: true,
      data: responseData,
    };
  } catch (error: any) {
    console.error("Exception during direct signup:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

/**
 * Create demo users directly using the REST API
 */
export async function createDemoUsersDirect(): Promise<boolean> {
  const demoUsers = [
    {
      email: "martha@example.com",
      password: "password123",
      userData: {
        full_name: "Martha Johnson",
        role: "customer",
      },
    },
    {
      email: "helper@example.com",
      password: "password123",
      userData: {
        full_name: "Henry Helper",
        role: "helper",
      },
    },
    {
      email: "admin@example.com",
      password: "password123",
      userData: {
        full_name: "Admin User",
        role: "admin",
      },
    },
  ];

  let success = true;

  for (const user of demoUsers) {
    console.log(`Creating demo user: ${user.email}`);
    const result = await directCreateUser(
      user.email,
      user.password,
      user.userData,
    );

    if (!result.success) {
      console.error(`Failed to create ${user.email}:`, result.error);
      // If the error is that the user already exists, that's okay
      if (
        result.statusCode === 400 &&
        result.data?.msg?.includes("already registered")
      ) {
        console.log(`User ${user.email} already exists, skipping`);
        continue;
      }
      success = false;
    } else {
      console.log(`Successfully created ${user.email}`);
    }
  }

  return success;
}

/**
 * Sign out and clear local storage
 */
export function directSignOut(): void {
  localStorage.removeItem("supabase.auth.token");
  localStorage.removeItem("senior_assist_auth");
  console.log("Direct auth: signed out and cleared storage");
}

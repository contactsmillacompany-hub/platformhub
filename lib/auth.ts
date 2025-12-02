import { supabase } from "./supabaseClient";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export async function signUp(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    if (!supabase) {
      return { user: null, error: "Supabase is not configured" };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name,
        },
        error: null,
      };
    }

    return { user: null, error: "Failed to create account" };
  } catch (err) {
    console.error("Sign up error:", err);
    return { user: null, error: "An unexpected error occurred" };
  }
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    if (!supabase) {
      return { user: null, error: "Supabase is not configured" };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name,
        },
        error: null,
      };
    }

    return { user: null, error: "Failed to sign in" };
  } catch (err) {
    console.error("Sign in error:", err);
    return { user: null, error: "An unexpected error occurred" };
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      return { error: "Supabase is not configured" };
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error("Sign out error:", err);
    return { error: "An unexpected error occurred" };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    if (!supabase) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name,
      };
    }

    return null;
  } catch (err) {
    console.error("Get current user error:", err);
    return null;
  }
}

export async function getSession() {
  try {
    if (!supabase) {
      return null;
    }

    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (err) {
    console.error("Get session error:", err);
    return null;
  }
}

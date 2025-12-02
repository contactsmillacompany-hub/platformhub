"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, getCurrentUser, signIn, signUp, signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return { error: result.error };
  };

  const handleSignUp = async (email: string, password: string) => {
    const result = await signUp(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return { error: result.error };
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.error) {
      setUser(null);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// lib/context/AuthContext.ts
"use client"; // Must be a client component

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from '../firebase/firebase';
import { useRouter } from "next/navigation";

/**
 * AuthContext now primarily provides user state and authentication status.
 * Direct Firebase authentication calls are handled in components.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // Client-only redirect to avoid SSR mismatches
      if (typeof window !== "undefined") {
        // If user exists but is not verified and not already on the verify-email page, redirect them there
        if (user && user.emailVerified === false && window.location.pathname !== "/verify-email") {
          router.push("/verify-email");
        }
        // If the user is on the verify-email page but is already verified, redirect to dashboard
        else if (user && user.emailVerified === true && window.location.pathname === "/verify-email") {
          router.push("/dashboard");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    // Call signOut and navigate to home page
    await signOut(auth);
    router.push("/");
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children} {/* Prevent rendering until auth state is known */}
    </AuthContext.Provider>
  );
};
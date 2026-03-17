"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth";

/** 在 client 掛載時從 Supabase session 還原登入狀態到 store */
export function AuthHydration() {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          email: u.email ?? "",
          name: (u.user_metadata?.user_name ?? u.user_metadata?.name) ?? "",
          created_at: u.created_at ?? "",
          updated_at: u.updated_at ?? "",
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, [setUser, setIsAuthenticated]);

  return null;
}

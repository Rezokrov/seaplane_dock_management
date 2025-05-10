"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("OCC" | "VIEW")[]; // Optional role restriction
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userEmail = session?.user.email;

      // Hardcoded role assignments
      const userRole =
        userEmail === "occ@test.com"
          ? "OCC"
          : userEmail === "view@test.com"
          ? "VIEW"
          : null;

      if (!session) {
        router.push("/login");
      } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // If role isn't allowed, redirect to dashboard
        router.push("/dashboard");
      } else {
        setIsAuthorized(true);
      }

      setLoading(false);
    };

    checkSession();
  }, [router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
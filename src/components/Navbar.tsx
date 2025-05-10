"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<"OCC" | "VIEW" | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userEmail = session?.user.email;

      if (userEmail === "occ@test.com") setRole("OCC");
      else if (userEmail === "view@test.com") setRole("VIEW");
      else setRole(null);

      setIsCheckingAuth(false);
    };

    fetchUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole(); // Re-fetch role when auth state changes
    });

    return () => {
      authListener.subscription.unsubscribe(); // Clean up on unmount
    };
  }, []);

  // Hide Navbar on /login or while checking auth state
  if (isCheckingAuth || pathname === "/login") {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", roles: ["OCC", "VIEW"] },
    { href: "/docks", label: "Docks", roles: ["OCC", "VIEW"] },
    { href: "/fleet", label: "Fleet", roles: ["OCC"] },
    { href: "/reports", label: "Reports", roles: ["OCC"] },
  ];

  const filteredLinks = role ? navLinks.filter((link) => link.roles.includes(role)) : [];

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Dock Manager
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {filteredLinks.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "default" : "ghost"}
              asChild
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {/* Logout Button */}
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Mobile Dropdown */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filteredLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="w-full">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
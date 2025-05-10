"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docks", label: "Docks" },
  { href: "/fleet", label: "Fleet" },
  { href: "/reports", label: "Reports" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Dock Manager
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "default" : "ghost"}
              asChild
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
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
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="w-full">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
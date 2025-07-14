"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import UserProfile from "@/src/components/UserProfile";
import { LayoutDashboard, Link2, BarChart3, Settings, User, HelpCircle, LogOut, Plus, History, Shield, Home, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Dashboard overview",
  },
  {
    title: "URLs",
    href: "/dashboard/urls",
    icon: Link2,
    description: "Manage your links",
    badge: "3",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "View statistics",
  },
  {
    title: "Create URL",
    href: "/dashboard/create",
    icon: Plus,
    description: "Shorten new URL",
    highlight: true,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: History,
    description: "Click history",
  },
  {
    title: "Security",
    href: "/dashboard/security",
    icon: Shield,
    description: "Security settings",
  },
];

const bottomItems = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account settings",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Your profile",
  },
  {
    title: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
    description: "Get help",
  },
];

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 lg:hidden">
        <div className="flex flex-col h-full">
          {" "}
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
              <Link2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">iShort</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* User Profile */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <UserProfile />
          </div>
          {/* Main Navigation */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive(item.href) ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" : "text-gray-600 dark:text-gray-400",
                    item.highlight && "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                  )}>
                  <div className="flex items-center space-x-3">
                    <item.icon className={cn("h-5 w-5", item.highlight && "text-white")} />
                    <div className="flex flex-col">
                      <span className={cn(item.highlight && "text-white")}>{item.title}</span>
                      <span className={cn("text-xs opacity-70", item.highlight && "text-white/80")}>{item.description}</span>
                    </div>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-800"></div>

            {/* Bottom Navigation */}
            <nav className="space-y-2">
              {bottomItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive(item.href) ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" : "text-gray-600 dark:text-gray-400"
                  )}>
                  <item.icon className="h-5 w-5 mr-3" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Link href="/" onClick={onClose} className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Home className="h-5 w-5 mr-3" />
              <span>Back to Home</span>
            </Link>

            <Button
              variant="ghost"
              className="w-full justify-start mt-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => {
                onClose();
                // Handle logout logic here
                console.log("Logout clicked");
              }}>
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

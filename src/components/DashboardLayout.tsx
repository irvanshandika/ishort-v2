"use client";
import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Menu } from "lucide-react";
import DashboardSidebar from "@/src/components/DashboardSidebar";
import MobileSidebar from "@/src/components/MobileSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-80 lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="w-10" />
            {/* Spacer for centering */}
          </div>
        </div>

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}

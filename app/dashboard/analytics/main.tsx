"use client";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/src/lib/firebase";
import DashboardLayout from "@/src/components/DashboardLayout";

export default function AnalyticsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/forbidden");
    }
  }, [user, loading, router]);
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Detailed analytics and performance metrics for your URLs</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-400">Analytics dashboard content will be implemented here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

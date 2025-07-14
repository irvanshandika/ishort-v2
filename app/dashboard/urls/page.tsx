import React from "react";
import DashboardLayout from "@/src/components/DashboardLayout";

export default function URLsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">URL Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all your shortened URLs in one place</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-400">URL management page content will be implemented here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

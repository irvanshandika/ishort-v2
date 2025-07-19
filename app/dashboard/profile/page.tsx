import React from "react";
import ProfilePage from "./main";
import DashboardLayout from "@/src/components/DashboardLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

function page() {
  return (
    <>
      <DashboardLayout>
        <ProfilePage />
      </DashboardLayout>
    </>
  );
}

export default page;

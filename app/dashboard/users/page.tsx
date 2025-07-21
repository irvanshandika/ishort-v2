import React from "react";
import { Metadata } from "next";
import DashboardLayout from "@/src/components/DashboardLayout";
import DashboardUsers from "./main";

export const metadata: Metadata = {
  title: "Dashboard",
};

function page() {
  return (
    <DashboardLayout>
      <DashboardUsers />
    </DashboardLayout>
  );
}

export default page;

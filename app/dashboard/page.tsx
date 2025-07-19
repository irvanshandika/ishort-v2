import React from "react";
import { Metadata } from "next";
import DashboardLayout from "@/src/components/DashboardLayout";
import DashboardMain from "./main";

export const metadata: Metadata = {
  title: "Dashboard",
};

function page() {
  return (
    <DashboardLayout>
      <DashboardMain />
    </DashboardLayout>
  );
}

export default page;

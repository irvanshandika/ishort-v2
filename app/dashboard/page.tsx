import React from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import DashboardMain from "./main";

function page() {
  return (
    <DashboardLayout>
      <DashboardMain />
    </DashboardLayout>
  );
}

export default page;

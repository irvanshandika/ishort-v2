import React from "react";
import { Metadata } from "next";
import AnalyticsPage from "./main";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
};

function page() {
  return (
    <>
      <AnalyticsPage />
    </>
  );
}

export default page;

import React from "react";
import { Metadata } from "next";
import SettingsPage from "./main";

export const metadata: Metadata = {
  title: "Dashboard Settings",
};

function page() {
  return (
    <>
      <SettingsPage />
    </>
  );
}

export default page;

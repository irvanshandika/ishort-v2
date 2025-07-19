import React from "react";
import { Metadata } from "next";
import URLsPage from "./main";

export const metadata: Metadata = {
  title: "My URLs",
};

function page() {
  return (
    <>
      <URLsPage />
    </>
  );
}

export default page;

import React from "react";
import { Metadata } from "next";
import CreatePage from "./main";

export const metadata: Metadata = {
  title: "Create URL",
};

function page() {
  return (
    <>
      <CreatePage />
    </>
  );
}

export default page;

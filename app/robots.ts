import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/auth/", "/api/", "/404", "/error-404-animated", "/forbidden"],
    },
    sitemap: "https://ishort.ly/sitemap.xml",
  };
}

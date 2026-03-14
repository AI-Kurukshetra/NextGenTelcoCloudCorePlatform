import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://ngcmcp.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://ngcmcp.com/features", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://ngcmcp.com/pricing", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://ngcmcp.com/docs", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://ngcmcp.com/login", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: "https://ngcmcp.com/signup", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];
}

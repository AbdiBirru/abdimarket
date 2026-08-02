import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await prisma.product.findMany({
    select: { id: true, createdAt: true },
  });

  return [
    { url: baseUrl, lastModified: new Date() },
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.createdAt,
    })),
  ];
}

import { cache } from "react";
import { prisma } from "./prisma";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

export type ProductWithGallery = Product & {
  images: string[];
};

export type ProductFilters = {
  query?: string;
  category?: string;
  sort?: string;
  page?: number;
};

const PAGE_SIZE = 6;

export async function getProducts(
  filters: ProductFilters = {}
): Promise<{ products: Product[]; totalPages: number }> {
  const { query, category, sort, page = 1 } = filters;

  const where = {
    ...(query ? { name: { contains: query, mode: "insensitive" as const } } : {}),
    ...(category && category !== "All" ? { category } : {}),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy:
        sort === "price-asc"
          ? { price: "asc" as const }
          : sort === "price-desc"
          ? { price: "desc" as const }
          : { createdAt: "asc" as const },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      category: p.category,
      stock: p.stock,
    })),
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
  };
}

export const getProductById = cache(async (id: string): Promise<ProductWithGallery | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    category: product.category,
    stock: product.stock,
    images: [product.imageUrl, ...product.images.map((img) => img.url)],
  };
});

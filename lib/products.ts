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

export type ProductFilters = {
  query?: string;
  category?: string;
  sort?: string;
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { query, category, sort } = filters;

  const products = await prisma.product.findMany({
    where: {
      ...(query ? { name: { contains: query, mode: "insensitive" as const } } : {}),
      ...(category && category !== "All" ? { category } : {}),
    },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" as const }
        : sort === "price-desc"
        ? { price: "desc" as const }
        : { createdAt: "asc" as const },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
    stock: p.stock,
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    category: product.category,
    stock: product.stock,
  };
}

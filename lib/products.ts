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

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
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

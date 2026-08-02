import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h2 className="font-display text-xl text-ink">Edit Product</h2>
      <div className="mt-6">
        <ProductForm
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            category: product.category,
            imageUrl: product.imageUrl,
            stock: product.stock,
            additionalImageUrls: product.images.map((img) => img.url),
          }}
        />
      </div>
    </div>
  );
}

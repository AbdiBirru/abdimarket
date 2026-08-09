"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productSchema } from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/lib/actions/products";

type Props = {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    additionalImageUrls: string[];
  };
};

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price.toString() ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [stock, setStock] = useState(product?.stock.toString() ?? "");
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>(
    product?.additionalImageUrls ?? []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updatePhoto(index: number, value: string) {
    setAdditionalImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  function removePhoto(index: number) {
    setAdditionalImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    const result = productSchema.safeParse({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
      additionalImageUrls: additionalImageUrls.filter((url) => url.trim() !== ""),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const response = product
      ? await updateProduct(product.id, result.data)
      : await createProduct(result.data);

    setIsSubmitting(false);

    if ("error" in response) {
      setSubmitError(response.error);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-ink">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
        />
        {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-2xl border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
        />
        {errors.description && <p className="mt-1 text-xs text-error">{errors.description}</p>}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-ink">Price</label>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
          {errors.price && <p className="mt-1 text-xs text-error">{errors.price}</p>}
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-ink">Stock</label>
          <input
            type="text"
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          />
          {errors.stock && <p className="mt-1 text-xs text-error">{errors.stock}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
        />
        {errors.category && <p className="mt-1 text-xs text-error">{errors.category}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Cover Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://picsum.photos/seed/whatever/600/600"
          className="mt-1 w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
        />
        {errors.imageUrl && <p className="mt-1 text-xs text-error">{errors.imageUrl}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Additional Photos</label>
        <div className="mt-2 flex flex-col gap-2">
          {additionalImageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => updatePhoto(index, e.target.value)}
                placeholder="https://picsum.photos/seed/extra/600/600"
                className="flex-1 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink focus:border-brand focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="text-sm text-ink/50 hover:text-error"
              >
                Remove
              </button>
            </div>
          ))}
          {errors.additionalImageUrls && (
            <p className="text-xs text-error">{errors.additionalImageUrls}</p>
          )}
          <button
            type="button"
            onClick={() => setAdditionalImageUrls((prev) => [...prev, ""])}
            className="self-start text-sm font-medium text-brand hover:underline"
          >
            + Add another photo
          </button>
        </div>
      </div>

      {submitError && <p className="text-sm text-error">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-full bg-brand px-6 py-3 font-medium text-on-brand hover:bg-brand-hover disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}

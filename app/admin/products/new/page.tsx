import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h2 className="font-display text-xl text-ink">New Product</h2>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}

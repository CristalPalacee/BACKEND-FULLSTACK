import { ProductForm } from "@/components/admin/products/product-form";
import type { Category } from "@/lib/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  });

  const result = await res.json();

  return result.data;
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl  font-semibold text-foreground">
          Tambah Produk
        </h1>
        <p className="text-muted-foreground">
          Tambahkan akun game baru untuk dijual.
        </p>
      </div>
      <div className="space-y-6 px-10 md:px-10">
        <ProductForm mode="create" categories={categories} />
      </div>
    </div>
  );
}
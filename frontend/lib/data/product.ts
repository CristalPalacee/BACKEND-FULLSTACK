import type { Product } from "@/lib/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPublicProducts() {
  const res = await fetch(`${API_URL}/product`, {
    next: {
      revalidate: 60,
      tags: ["products"],
    },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil produk");
  }

  const result = await res.json();

  return result.data.items as Product[];
}

export async function getProductById({ id }: { id: string }) {
  const res = await fetch(`${API_URL}/product/${id}`, {
    next: {
      revalidate: 60,
      tags: [`product-${id}`],
    },
  });

  if (!res.ok) {
    return null;
  }

  const result = await res.json();

  return result.data as Product;
}
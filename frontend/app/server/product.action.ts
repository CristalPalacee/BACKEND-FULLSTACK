"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { AccountInput, AccountSchema } from "@/lib/schema/produk-acount";
import type { Category, Product } from "@/lib/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ActionResult = {
  success: boolean;
  message: string;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
};

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(await getAuthHeaders()),
      ...options?.headers,
    },
    cache: "no-store",
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message ?? "Request gagal");
  }

  return result as T;
}

/**
 *  Ambil semua kategori (public, tanpa auth)
 */
export async function getCategories(): Promise<Category[]> {
  const result = await apiFetch<ApiResponse<Category[]>>("/categories");

  return result.data ?? [];
}


/**
 *  Ambil semua product milik seller (butuh token)
 */
export async function getProducts(): Promise<Product[]> {
  const result = await apiFetch<ApiResponse<Product[]>>("/product/seller/me");

  return result.data ?? [];
}



/**
 *  Ambil 1 product berdasarkan id
 */
export async function getSellerProductById(
  id: string,
): Promise<Product | null> {
  try {
    const result = await apiFetch<ApiResponse<Product>>(
      `/product/seller/me/${id}`,
    );

    return result.data;
  } catch {
    return null;
  }
}



/**
 *  BUAT PRODUCT
 */
export async function createProductAction(
  input: AccountInput,
): Promise<ActionResult> {
  const parsed = AccountSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Data produk tidak valid",
    };
  }

  try {
    await apiFetch<ApiResponse<Product>>("/product", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    revalidatePath("/seller/products");

    return {
      success: true,
      message: "Produk berhasil ditambahkan",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal menambahkan produk",
    };
  }
}




/**
 *  UPDATE PRODUCT
 */
export async function updateProductAction(id: string,input: AccountInput,): Promise<ActionResult> {
  const parsed = AccountSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Data produk tidak valid",
    };
  }

  try {
    await apiFetch<ApiResponse<Product>>(`/product/${id}`, {
      method: "PATCH",
      body: JSON.stringify(parsed.data),
    });

    revalidatePath("/seller/products");
    revalidatePath(`/seller/products/${id}/edit`);

    return {
      success: true,
      message: "Produk berhasil diperbarui",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memperbarui produk",
    };
  }
}




/**
 *  HAPUS PRODUCT
 */
export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    await apiFetch<ApiResponse<Product>>(`/product/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/seller/products");

    return {
      success: true,
      message: "Produk berhasil dihapus",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus produk",
    };
  }
}
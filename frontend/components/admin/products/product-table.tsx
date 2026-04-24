"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { alert } from "@/lib/alert/alerts";
import { deleteProductAction } from "@/app/server/product.action";
import { Product } from "@/lib/types/product";

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const confirm = await alert.confirm(
      "Hapus produk?",
      "Produk tidak bisa dikembalikan"
    );

    if (!confirm.isConfirmed) return;

    alert.loading("Menghapus...");

    const res = await deleteProductAction(id);

    alert.close();

    if (!res.success) {
      await alert.error("Gagal", res.message);
      return;
    }

    await alert.success("Berhasil", res.message);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => router.push("/seller/products/new")}>
        + Tambah Produk
      </Button>

    <div className="rounded-lg border overflow-hidden">
  <table className="w-full table-fixed">
    <thead className="bg-muted">
      <tr className="text-left text-sm">
        <th className="p-3 w-[40%]">Nama</th>
        <th className="p-3 w-[20%]">Harga</th>
        <th className="p-3 w-[15%]">Stok</th>
        <th className="p-3 w-[25%]">Aksi</th>
      </tr>
    </thead>

    <tbody className="text-sm">
      {products.map((product) => (
        <tr
          key={product.id}
          className="border-t hover:bg-muted/50 transition"
        >
          <td className="p-3 truncate">{product.name}</td>

          <td className="p-3">
            Rp {product.price.toLocaleString()}
          </td>

          <td className="p-3">{product.stock}</td>

          <td className="p-3 space-x-2">
            <button className="px-3 py-1 text-xs bg-black text-white rounded">
              Edit
            </button>

            <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded">
              Hapus
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}
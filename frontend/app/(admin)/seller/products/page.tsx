import { getProducts } from "@/app/server/product.action";
import { ProductTable } from "@/components/admin/products/product-table";


export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Produk Saya</h1>

      <ProductTable products={products} />
    </div>
  );
}
import { ProductGrid } from "@/components/public/card/product-grid";
import { Button } from "@/components/ui/button";
import { getPublicProducts } from "@/lib/data/product";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default async function ProductsPage() {
  const products = await getPublicProducts();

  return (
    <main className="min-h-screen bg-[#05081f] px-6 py-12 text-white">
      <section className="mx-auto pt-30 max-w-7xl">
        <div>
            <Button
              asChild
              variant="outline"
              className="mb-8 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Kembali ke Beranda
              </Link>
            </Button>
        </div>
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-5 w-1 rounded bg-orange-600" />
            <p className="font-bold uppercase text-orange-400">
              All MLBB Accounts
            </p>
          </div>

          <h1 className="text-4xl font-black">
            Semua Akun Mobile Legends
          </h1>
        </div>

        <ProductGrid products={products} />
      </section>
    </main>
  );
}
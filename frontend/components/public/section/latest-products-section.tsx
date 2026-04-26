import Link from "next/link";
import type { Product } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "../card/product-grid";

type LatestProductsSectionProps = {
  products: Product[];
};

export function LatestProductsSection({
  products,
}: LatestProductsSectionProps) {
  return (
    <section id="latest-products" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-5 w-1 rounded bg-orange-600" />
            <p className="font-bold uppercase text-orange-400">
              Latest MLBB Accounts
            </p>
          </div>

          <h2 className="text-3xl font-black">
            Akun Mobile Legends Terbaru
          </h2>
        </div>

        <Button
          asChild
          variant="outline"
          className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/products">View All</Link>
        </Button>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
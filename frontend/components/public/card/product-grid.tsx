"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/types/product";
import { ProductCard } from "./product-card";

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
        Produk belum tersedia.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
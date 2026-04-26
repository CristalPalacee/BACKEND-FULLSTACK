import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/hooks/cart/use-cart";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const { addToCart, isInCart } = useCart();
  const productAlreadyInCart = isInCart(product.id);
   const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.thumbnailUrl ?? undefined,
      category: product.gameTitle,
    });
  };
  return (
    <Card className="group overflow-hidden border-white/10 bg-[#111735] text-white shadow-xl transition hover:-translate-y-1 hover:border-orange-500/60">
      <div className="relative h-48 overflow-hidden bg-muted">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-900 to-orange-900/40 text-sm text-white/60">
            No Image
          </div>
        )}

        <Badge className="absolute left-3 top-3 bg-orange-600 text-white">
          {product.gameTitle}
        </Badge>
      </div>

      <CardContent className="space-y-4 p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-bold hover:text-orange-400">
            {product.name}
          </h3>
        </Link>

        <div className="text-sm text-white/60">
          Rank: {product.rank ?? "-"} · Level: {product.accountLevel ?? "-"}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-white/50">Harga</p>
            <p className="font-bold text-orange-400">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <Button onClick={handleAddToCart} size="icon" className={
              productAlreadyInCart
                ? "bg-green-600 hover:bg-green-700"
                : "bg-orange-600 hover:bg-orange-700"
            }>
             {productAlreadyInCart ? (
              <Check className="size-4" />
            ) : (
              <ShoppingCart className="size-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
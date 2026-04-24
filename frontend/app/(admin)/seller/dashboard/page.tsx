import Link from "next/link";
import { Package, ShoppingCart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProducts } from "@/app/server/product.action";

export default async function SellerDashboardPage() {
   const products = await getProducts();
   const totalProduct = products.length
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            Ringkasan performa toko dan produk Anda.
          </p>
        </div>

        <Button asChild>
          <Link href="/seller/products/new">Tambah Produk</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Produk
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProduct}</p>
            <p className="text-xs text-muted-foreground">
              Produk aktif dan draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Order
            </CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">
              Order dari pembeli
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Pendapatan
            </CardTitle>
            <Wallet className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Rp 0</p>
            <p className="text-xs text-muted-foreground">
              Estimasi dari order paid
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
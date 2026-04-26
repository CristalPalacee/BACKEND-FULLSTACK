import Link from "next/link";
import { Package, LayoutDashboard, PlusCircle } from "lucide-react";

export function SellerSidebar() {
  return (
    <aside className="hidden border-r bg-background md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/seller/dashboard" className="font-semibold text-primary">
          Seller Panel
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        <Link
          href="/seller/dashboard"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>

        <Link
          href="/seller/products"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Package className="size-4" />
          Produk
        </Link>

        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <PlusCircle className="size-4" />
          Tambah Produk
        </Link>
      </nav>
    </aside>
  );
}
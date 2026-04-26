import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/data/product";
import { ArrowLeft, Gamepad2, ShieldCheck, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SpotlightBackground } from "@/components/ui/spotlight";
import Image from "next/image";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById({ id });

  if (!product) {
    notFound();
  }

  return (
      <main className="relative min-h-screen overflow-hidden bg-[#05081f] text-white">
      <SpotlightBackground />

      <section className="relative z-10 mx-auto max-w-7xl px-6 justify-center pt-30 py-10">
        <Button
          asChild
          variant="outline"
          className="mb-8 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/products">
            <ArrowLeft className="mr-2 size-4" />
            Kembali ke Produk
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 shadow-2xl">
              <div className="relative h-90 bg-linear-to-br from-blue-950 via-indigo-900 to-orange-700">
                {product.thumbnailUrl ? (
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <p className="text-6xl font-black">MLBB</p>
                      <p className="mt-2 text-white/60">
                        Premium Account
                      </p>
                    </div>
                  </div>
                )}

                <Badge className="absolute left-6 top-6 bg-orange-600 text-white">
                  {product.status}
                </Badge>
              </div>

              <div className="p-6 md:p-8">
                <p className="mb-2 text-sm font-bold uppercase text-orange-400">
                  {product.gameTitle}
                </p>

                <h1 className="text-4xl font-black tracking-tight">
                  {product.name}
                </h1>

                <p className="mt-4 max-w-3xl text-white/60">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/4 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-2">
                <Gamepad2 className="size-5 text-orange-400" />
                <h2 className="text-2xl font-black">Detail Akun</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="Game" value={product.gameTitle} />
                <DetailItem label="Level" value={product.accountLevel ?? "-"} />
                <DetailItem label="Rank" value={product.rank ?? "-"} />
                <DetailItem label="Region" value={product.serverRegion ?? "-"} />
                <DetailItem label="Metode Login" value={product.loginMethod ?? "-"} />
                <DetailItem label="Stok" value={product.stock} />
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/4 p-6 shadow-2xl lg:sticky lg:top-8">
            <div className="rounded-2xl border border-orange-500/20 bg-orange-600/10 p-5">
              <p className="text-sm text-white/50">Harga</p>
              <p className="mt-1 text-4xl font-black text-orange-400">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-orange-400" />
                Seller terdaftar
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-orange-400" />
                Checkout aman via payment gateway
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-orange-400" />
                Produk aktif dan tersedia
              </div>
            </div>

            <Button className="mt-8 w-full bg-orange-600 font-bold hover:bg-orange-700">
              <ShoppingCart className="mr-2 size-4" />
              Beli Sekarang
            </Button>

            <p className="mt-4 text-center text-xs text-white/40">
              Dengan membeli, Anda menyetujui ketentuan transaksi marketplace.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}


function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs uppercase text-white/40">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}
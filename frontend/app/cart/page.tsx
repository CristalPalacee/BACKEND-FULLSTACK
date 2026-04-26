"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpotlightBackground } from "@/components/ui/spotlight";
import { useCart } from "@/hooks/cart/use-cart";
import { useWhatsapp } from "@/hooks/ctwa/use-whatsapp";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { sendToWhatsapp } = useWhatsapp({
    phone: "628123456789", // ganti nomor WA kamu
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05081f] text-white">
      <SpotlightBackground />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-30 py-10">
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

        <div className="mb-8">
          <Badge className="mb-3 bg-orange-600 text-white">
            Keranjang Belanja
          </Badge>

          <h1 className="text-4xl font-black tracking-tight">
            Checkout Akun Game
          </h1>

          <p className="mt-3 text-white/60">
            Cek kembali akun game yang ingin kamu beli sebelum lanjut ke
            WhatsApp.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/4 p-10 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
              <ShoppingCart className="size-8" />
            </div>

            <h2 className="mt-6 text-2xl font-black">Keranjang kosong</h2>

            <p className="mx-auto mt-3 max-w-md text-white/60">
              Belum ada akun game yang kamu tambahkan ke keranjang.
            </p>

            <Button
              asChild
              className="mt-8 bg-orange-600 font-bold hover:bg-orange-700"
            >
              <Link href="/products">Lihat Produk</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <section className="space-y-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/4 p-4 shadow-2xl"
                >
                  <div className="flex gap-4">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-blue-950 via-indigo-900 to-orange-700">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase text-orange-400">
                          {item.category ?? "Game Account"}
                        </p>

                        <h2 className="line-clamp-2 font-black">
                          {item.name}
                        </h2>

                        <p className="mt-2 font-bold text-orange-400">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 p-1">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
                          >
                            <Minus className="size-4" />
                          </button>

                          <span className="min-w-8 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeFromCart(item.id)}
                          className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/4 p-6 shadow-2xl lg:sticky lg:top-28">
              <div className="rounded-2xl border border-orange-500/20 bg-orange-600/10 p-5">
                <p className="text-sm text-white/50">Total Pembayaran</p>

                <p className="mt-1 text-4xl font-black text-orange-400">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </p>

                <p className="mt-2 text-sm text-white/50">
                  {totalItems} item di keranjang
                </p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-orange-400" />
                  Pesanan dikirim ke admin via WhatsApp
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-orange-400" />
                  Pastikan data produk sudah benar
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-orange-400" />
                  Admin akan konfirmasi ketersediaan akun
                </div>
              </div>

              <Button
                type="button"
                onClick={sendToWhatsapp}
                className="mt-8 w-full bg-green-600 font-bold hover:bg-green-700"
              >
                <MessageCircle className="mr-2 size-4" />
                Checkout via WhatsApp
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={clearCart}
                className="mt-3 w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                Kosongkan Keranjang
              </Button>

              <p className="mt-4 text-center text-xs text-white/40">
                Dengan membeli, Anda menyetujui ketentuan transaksi marketplace.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
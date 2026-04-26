import Link from "next/link";
import { Gamepad2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpotlightBackground } from "@/components/ui/spotlight";

export function HeroSection() {
  return (
    <section className="relative">
      <SpotlightBackground/>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-30 lg:grid-cols-[1fr_520px]">
        <div className="space-y-8">
          <Badge className="bg-orange-600/20 text-orange-300 hover:bg-orange-600/20">
            Marketplace Akun Mobile Legends
          </Badge>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Jual Beli Akun Mobile Legends Aman & Cepat
            </h1>

            <p className="max-w-xl text-lg text-white/60">
              Temukan akun MLBB dengan rank tinggi, skin kolektor, hero lengkap,
              dan statistik menarik dari seller terpercaya.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-orange-600 font-bold hover:bg-orange-700"
            >
              <Link href="#latest-products">Lihat Produk</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/register">Mulai Jualan</Link>
            </Button>
          </div>

          <div className="grid max-w-xl gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <Gamepad2 className="mb-3 size-5 text-orange-400" />
              <p className="font-bold">Rank Tinggi</p>
              <p className="text-sm text-white/50">Mythic, Honor, Glory</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mb-3 size-5 text-orange-400" />
              <p className="font-bold">Akun Aman</p>
              <p className="text-sm text-white/50">Seller terpercaya</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <Sparkles className="mb-3 size-5 text-orange-400" />
              <p className="font-bold">Skin Premium</p>
              <p className="text-sm text-white/50">Collector, Epic, Legend</p>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-0 rotate-6 rounded-[2rem] bg-orange-600/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl">
            <div className="flex h-130 items-center justify-center rounded-[1.5rem] bg-linear-to-br from-blue-950 via-indigo-900 to-orange-700">
              <div className="text-center">
                <p className="text-6xl font-black">MLBB</p>
                <p className="mt-2 text-white/60">
                  Premium Account Marketplace
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
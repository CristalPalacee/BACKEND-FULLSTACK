import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SellerCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-[2rem] border border-white/10 bg-linear-to-r from-orange-600/20 to-blue-600/20 p-8 md:p-12">
        <h2 className="text-3xl font-black">
          Punya akun Mobile Legends untuk dijual?
        </h2>

        <p className="mt-3 max-w-2xl text-white/60">
          Daftar sebagai seller dan mulai jual akun MLBB Anda ke pembeli yang
          tepat.
        </p>

        <Button asChild className="mt-6 bg-orange-600 hover:bg-orange-700">
          <Link href="/register">Daftar Seller</Link>
        </Button>
      </div>
    </section>
  );
}
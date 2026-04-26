import { BadgeCheck, CreditCard, Zap } from "lucide-react";

const features = [
  {
    title: "Checkout Cepat",
    description: "Bayar mudah dengan integrasi Midtrans.",
    icon: CreditCard,
  },
  {
    title: "Seller Terpercaya",
    description: "Akun dijual oleh seller yang terdaftar.",
    icon: BadgeCheck,
  },
  {
    title: "Produk Terbaru",
    description: "Listing akun MLBB terus diperbarui.",
    icon: Zap,
  },
];

export function FeatureSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/4 p-6"
            >
              <Icon className="mb-4 size-6 text-orange-400" />
              <h3 className="font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm text-white/50">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
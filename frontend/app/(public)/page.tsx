import { FeatureSection } from "@/components/public/section/feature-section";
import { HeroSection } from "@/components/public/section/hero-section";
import { LatestProductsSection } from "@/components/public/section/latest-products-section";
import { SellerCtaSection } from "@/components/public/section/seller-cta-section";
import { getPublicProducts } from "@/lib/data/product";

export default async function HomePage() {
  const products = await getPublicProducts();

  return (
    <main className="min-h-screen overflow-hidden bg-[#05081f] text-white">
      <HeroSection />
      <FeatureSection />
      <LatestProductsSection products={products} />
      <SellerCtaSection />
    </main>
  );
}
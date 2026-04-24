import { SellerHeader } from "@/components/layout/seller-header";
import { SellerSidebar } from "@/components/layout/seller-sidebar";
import { getServerRole, getServerToken } from "@/lib/helper/auth";
import { redirect } from "next/navigation";


export const metadata = {
  title: "Seller Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getServerToken();
  const role = await getServerRole();

  if (!token) {
    redirect("/login");
  }

  if (role !== "SELLER" && role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        <SellerSidebar />

        <div className="flex min-w-0 flex-col">
          <SellerHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
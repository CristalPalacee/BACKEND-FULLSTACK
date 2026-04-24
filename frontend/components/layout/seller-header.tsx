import { logoutAction } from "@/app/server/auth.actions";
import { Button } from "@/components/ui/button";

export function SellerHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div>
        <p className="text-sm text-muted-foreground">Dashboard Penjual</p>
        <h1 className="text-lg font-semibold text-foreground">
          Kelola akun game Anda
        </h1>
      </div>

      <form action={logoutAction}>
        <Button type="submit" variant="outline">
          Logout
        </Button>
      </form>
    </header>
  );
}
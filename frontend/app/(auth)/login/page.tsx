import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login Seller</CardTitle>
          <CardDescription>
            Masuk untuk mengelola produk akun game Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Belum punya akun ?{" "}
            <Link href="/register" className="font-medium text-primary">
              Daftar seller
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
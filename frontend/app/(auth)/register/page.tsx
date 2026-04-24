import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full shadow-black/30 shadow-md max-w-md">
        <CardHeader>
          <CardTitle>Daftar Seller</CardTitle>
          <CardDescription>
            Buat akun seller untuk mulai menjual akun game.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun ?{" "}
            <Link href="/login" className="font-medium text-primary">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
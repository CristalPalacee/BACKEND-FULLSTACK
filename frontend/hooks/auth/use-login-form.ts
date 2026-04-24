"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/schema/auth-validation";
import { loginAction } from "@/app/server/auth.actions";
import { alert } from "@/lib/alert/alerts";
import { useRouter } from "next/navigation";



export function useLoginForm() {
     const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      alert.loading("Login...");

      const result = await loginAction(values);

      alert.close();

      if (!result?.success) {
        await alert.error("Login gagal", result?.message);
        return;
      }
     
      const confirm = await alert.success("Login berhasil", result?.message);

      if (confirm.isConfirmed) {
        router.push("seller/dashboard");
      }
    
    });
  }

  return {
    form,
    errors: form.formState.errors,
    isPending,
    onSubmit,
  };
}
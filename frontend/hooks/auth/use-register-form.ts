"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterInput, registerSchema } from "@/lib/schema/auth-validation";
import { alert } from "@/lib/alert/alerts";
import { registerAction } from "@/app/server/auth.actions";

export function useRegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });



  async function onSubmit(values: RegisterInput) {
    alert.loading("Mendaftarkan akun...");

    const result = await registerAction(values);
    console.log(result);

    alert.close();

    if (!result.success) {
      await alert.error("Register gagal", result.message);
      return;
    }

    const res = await alert.success("Register berhasil", result.message);

    form.reset();

    if (res.isConfirmed) {
      router.push("/login");
    }
  }

  return {
    form,
    errors: form.formState.errors,
    isPending,
    onSubmit,
  };
}

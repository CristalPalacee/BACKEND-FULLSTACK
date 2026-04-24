"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { alert } from "@/lib/alert/alerts";

import { AccountInput, AccountSchema } from "@/lib/schema/produk-acount";
import { createProductAction, updateProductAction } from "@/app/server/product.action";

type UseProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  defaultValues?: Partial<AccountInput>;
};

export function useProductForm({
  mode,
  productId,
  defaultValues,
}: UseProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AccountInput>({
    resolver :  zodResolver(AccountSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 1,
      categoryId: defaultValues?.categoryId ?? "",
      gameTitle: defaultValues?.gameTitle ?? "",
      accountLevel: defaultValues?.accountLevel ?? undefined,
      rank: defaultValues?.rank ?? "",
      serverRegion: defaultValues?.serverRegion ?? "",
      loginMethod: defaultValues?.loginMethod ?? "",
      thumbnailUrl: defaultValues?.thumbnailUrl ?? "",
      status: defaultValues?.status ?? "DRAFT",
    },
  });

  function onSubmit(values: AccountInput) {
    const parsed = AccountSchema.parse(values);
    startTransition(async () => {
      alert.loading(mode === "create" ? "Menambahkan produk..." : "Memperbarui produk...");

      const result =
        mode === "create"
          ? await createProductAction(parsed)
          : await updateProductAction(productId!, parsed);

      alert.close();

      if (!result.success) {
        await alert.error("Gagal Menambahkan Produk", result.message);
        return;
      }

      await alert.success("Berhasil Tambah Produk", result.message);

      if (mode === "create") {
        form.reset();
      }

      router.push("/seller/products");
      router.refresh();
    });
  }

  return {
    form,
    errors: form.formState.errors,
    isPending,
    onSubmit,
  };
}
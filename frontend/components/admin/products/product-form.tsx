"use client";

import type { Category } from "@/lib/types/product";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProductForm } from "@/hooks/products/product.hook";
import { AccountInput } from "@/lib/schema/produk-acount";

type ProductFormProps = {
  mode: "create" | "edit";
  categories: Category[];
  productId?: string;
  defaultValues?: Partial<AccountInput>;
};

export function ProductForm({
  mode,
  categories,
  productId,
  defaultValues,
}: ProductFormProps) {
  const { form, errors, isPending, onSubmit } = useProductForm({
    mode,
    productId,
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel>Nama Produk</FieldLabel>
          <Input {...form.register("name")} />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.slug}>
          <FieldLabel>Slug</FieldLabel>
          <Input placeholder="akun-mlbb-mythic" {...form.register("slug")} />
          {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.gameTitle}>
          <FieldLabel>Nama Game</FieldLabel>
          <Input placeholder="Mobile Legends" {...form.register("gameTitle")} />
          {errors.gameTitle && <FieldError>{errors.gameTitle.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.categoryId}>
          <FieldLabel>Kategori</FieldLabel>
          <Select
            defaultValue={form.getValues("categoryId")}
            onValueChange={(value) =>
              form.setValue("categoryId", value, { 
                shouldValidate: true,
                shouldDirty: true
            })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.categoryId && <FieldError>{errors.categoryId.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.price}>
          <FieldLabel>Harga</FieldLabel>
          <Input type="number" {...form.register("price")} />
          {errors.price && <FieldError>{errors.price.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.stock}>
          <FieldLabel>Stok</FieldLabel>
          <Input type="number" {...form.register("stock")} />
          {errors.stock && <FieldError>{errors.stock.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Level Akun</FieldLabel>
          <Input type="number" {...form.register("accountLevel")} />
        </Field>

        <Field>
          <FieldLabel>Rank</FieldLabel>
          <Input placeholder="Mythic / Radiant / Epic" {...form.register("rank")} />
        </Field>

        <Field>
          <FieldLabel>Region Server</FieldLabel>
          <Input placeholder="Indonesia / Asia" {...form.register("serverRegion")} />
        </Field>

        <Field>
          <FieldLabel>Metode Login</FieldLabel>
          <Input placeholder="Moonton / Gmail / Riot" {...form.register("loginMethod")} />
        </Field>

        <Field data-invalid={!!errors.thumbnailUrl}>
          <FieldLabel>Thumbnail URL</FieldLabel>
          <Input {...form.register("thumbnailUrl")} />
          {errors.thumbnailUrl && <FieldError>{errors.thumbnailUrl.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select
            defaultValue={form.getValues("status")}
            onValueChange={(value) =>
              form.setValue("status", value as AccountInput["status"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel>Deskripsi</FieldLabel>
          <Textarea rows={5} {...form.register("description")} />
          {errors.description && <FieldError>{errors.description.message}</FieldError>}
        </Field>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Menyimpan..."
            : mode === "create"
              ? "Tambah Produk"
              : "Simpan Perubahan"}
        </Button>
      </FieldGroup>
    </form>
  );
}
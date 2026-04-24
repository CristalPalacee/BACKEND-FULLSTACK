"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useRegisterForm } from "@/hooks/auth/use-register-form";

export function RegisterForm() {
  const { form, errors, isPending, onSubmit, } = useRegisterForm();



  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Nama</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Nama seller"
            autoComplete="name"
            {...form.register("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="seller@email.com"
            autoComplete="email"
            {...form.register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Minimal 6 karakter"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Mendaftarkan..." : "Daftar Seller"}
        </Button>
      </FieldGroup>
    </form>
  );
}
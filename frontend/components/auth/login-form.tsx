"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { LoginInput, loginSchema } from "@/lib/schema/auth-validation";
import { loginAction } from "@/app/server/auth.actions";
import { useLoginForm } from "@/hooks/auth/use-login-form";

export function LoginForm() {
  const { form, errors, isPending, onSubmit, } = useLoginForm();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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
            placeholder="••••••••"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Memproses..." : "Login"}
        </Button>
      </FieldGroup>
    </form>
  );
}
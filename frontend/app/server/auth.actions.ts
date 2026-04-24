"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/schema/auth-validation";
import type { LoginResponse, RegisterResponse } from "@/lib/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ActionResult = {
  success: boolean;
  message: string;
};

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Data login tidak valid",
    };
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed.data),
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    return {
      success: false,
      message: error?.message ?? "Login gagal",
    };
  }

  const result = (await res.json()) as LoginResponse;

  const cookieStore = await cookies();

  cookieStore.set("access_token", result.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("user_role", result.data.user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  
return {
  success: true,
  message: "Login berhasil",
};
}

export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Data register tidak valid",
    };
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parsed.data),
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    return {
      success: false,
      message: error?.message ?? "Register gagal",
    };
  }

  const _result = (await res.json()) as RegisterResponse;

  return {
    ..._result,
    success: true,
    message: "Register berhasil. Silakan login.",
  };
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
  cookieStore.delete("user_role");

  redirect("/login");
}
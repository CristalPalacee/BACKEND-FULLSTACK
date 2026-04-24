import { cookies } from "next/headers";

export async function getServerToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function getServerRole() {
  const cookieStore = await cookies();
  return cookieStore.get("user_role")?.value ?? null;
}
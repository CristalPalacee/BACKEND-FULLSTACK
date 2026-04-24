import { NextResponse, type NextRequest } from "next/server";

const SELLER_PATH_PREFIX = "/seller";
const AUTH_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  const isSellerRoute = pathname.startsWith(SELLER_PATH_PREFIX);
  const isAuthRoute = AUTH_PATHS.some((path) => pathname.startsWith(path));

  // 1. Proteksi route seller
  if (isSellerRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "SELLER" && role !== "ADMIN") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. Kalau sudah login sebagai seller/admin, jangan masuk login/register lagi
  if (isAuthRoute && token && (role === "SELLER" || role === "ADMIN")) {
    return NextResponse.redirect(new URL("/seller/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/seller/:path*",
    "/login",
    "/register",
  ],
};
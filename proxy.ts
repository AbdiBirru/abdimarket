export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/admin/:path*",
  ],
};

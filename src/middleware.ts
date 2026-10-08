import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "fallback-super-secret-key-change-in-prod";
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and all subroutes
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("myshule_session");

    if (!sessionCookie) {
      // Not logged in
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(sessionCookie.value, encodedKey, {
        algorithms: ["HS256"],
      });

      const role = payload.roleName as string;

      // --- ROUTE GUARDS (RBAC) ---
      // Here we can enforce strict path blocking based on the `role`.
      // For instance, if they are a PARENT, they shouldn't access /dashboard/settings
      const roleUpper = role.toUpperCase();

      if (roleUpper === "PARENT") {
        const allowedPrefixes = [
          "/dashboard", // root dashboard allowed
          "/dashboard/student-life", // maybe their children's stats
          "/dashboard/reports/financial/fees" // fee statements
        ];
        
        // If the path is strictly /dashboard, allow it
        if (pathname === "/dashboard") return NextResponse.next();
        
        // Ensure they only access allowed routes
        const isAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix));
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/dashboard", request.url)); // Redirect back to allowed area
        }
      }

      if (roleUpper === "TEACHER") {
        const allowedPrefixes = [
          "/dashboard",
          "/dashboard/student-life", 
          "/dashboard/reports/academic"
        ];
        if (pathname === "/dashboard") return NextResponse.next();
        
        const isAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix));
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }

      // If Super Admin, Assistant Admin, etc., allow access to everything for now
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect root to dashboard (which will redirect to login if not authenticated)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

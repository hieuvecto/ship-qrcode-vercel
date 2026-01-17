import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Skip authentication in development mode (for local testing without Google OAuth)
const SKIP_AUTH = process.env.SKIP_AUTH === "true";

export default withAuth(
  function middleware(req) {
    // Skip auth protection if SKIP_AUTH is enabled
    if (SKIP_AUTH) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Skip auth check if SKIP_AUTH is enabled
        if (SKIP_AUTH) {
          return true;
        }

        // Allow login and error pages
        if (
          req.nextUrl.pathname === "/admin/login" ||
          req.nextUrl.pathname === "/admin/error"
        ) {
          return true;
        }

        // User must be authenticated for admin routes
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};

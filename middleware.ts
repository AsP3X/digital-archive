import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if the user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token;
      console.log("DEBUG - Admin route access attempt:", {
        path: req.nextUrl.pathname,
        hasToken: !!token,
        isAdmin: token?.isAdmin,
        userId: token?.id
      });

      // If no token or user is not an admin, redirect to home
      if (!token || !token.isAdmin) {
        console.log("DEBUG - Unauthorized admin access attempt, redirecting to home");
        
        // Get all cookies before creating the response
        const cookiesToDelete = req.cookies.getAll()
          .filter(cookie => cookie.name.startsWith("next-auth"))
          .map(cookie => cookie.name);
        
        // Create the response
        const response = NextResponse.redirect(new URL("/", req.url));
        
        // Delete all NextAuth.js related cookies
        cookiesToDelete.forEach(cookieName => {
          response.cookies.delete(cookieName);
        });
        
        // Set an expired session cookie
        response.cookies.set("next-auth.session-token", "", {
          expires: new Date(0),
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          httpOnly: true,
        });
        
        return response;
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (!req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/archive")) {
          return true;
        }
        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 
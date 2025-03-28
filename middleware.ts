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
        // Clear the session by setting expired cookies
        const response = NextResponse.redirect(new URL("/", req.url));
        
        // Delete all NextAuth.js related cookies
        response.cookies.delete("next-auth.session-token");
        response.cookies.delete("next-auth.csrf-token");
        response.cookies.delete("next-auth.callback-url");
        
        // Set an expired session cookie
        response.cookies.set("next-auth.session-token", "", {
          expires: new Date(0),
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          httpOnly: true,
        });
        
        // Clear any other potential auth-related cookies
        req.cookies.getAll().forEach(cookie => {
          if (cookie.name.startsWith("next-auth")) {
            response.cookies.delete(cookie.name);
          }
        });
        
        return response;
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/archive/:path*"],
}; 
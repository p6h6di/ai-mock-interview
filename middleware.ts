import { NextResponse } from "next/server";
import { auth as middleware } from "@/lib/auth";

export default middleware((req) => {
  const { auth } = req;
  const { pathname } = req.nextUrl;

  // Allow all API requests
  if (pathname.startsWith("/api(/.*)")) {
    return NextResponse.next();
  }

  // Allow access to sign-in related routes
  const signInRelatedRoutes = ["/api/auth/signin", "/api/auth/callback"];
  if (signInRelatedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (auth?.user) {
    // User is authenticated
    if (pathname === "/") {
      // Redirect authenticated users from home to /interviews
      return NextResponse.redirect(new URL("/interviews", req.url));
    }
  } else {
    // User is not authenticated
    if (pathname !== "/" && !pathname.startsWith("/api/auth")) {
      // Redirect unauthenticated users to home page, except for auth-related API routes
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // For all other cases, continue with the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/interviews(/.*)?",
  ],
};

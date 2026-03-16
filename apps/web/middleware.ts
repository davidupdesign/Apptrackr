import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // reading the token from cookiues
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // if the user tries to access /dashboard or /applications without a token, redirect them to /login
  const isAppRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/applications");

  if (isAppRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if user lreadt has a token and visits login or signupo, theyre alreadt authenticated , so we send them to dashboard
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // else
  return NextResponse.next();
}

//only running the middleware on these routes
export const config = {
  matcher: ["/dashboard/:path*", "/applications/:path*", "/login", "/signup"],
};

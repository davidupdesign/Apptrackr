import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // reading the token from cookiues
  const token = request.cookies.get("token")?.value;

  // if no toekn - redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if toekn - allow the req
  return NextResponse.next();
}

//only running the middleware on these routes
export const config = {
  matcher: ["/dashboard/:path*", "/applications/:path*"],
};

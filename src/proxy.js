import { NextResponse } from "next/server";

const redirects = {
  "/aeo-services": "/services/aeo-services",
  "/seo-services": "/services/seo-services",
  "/web-development": "/services/web-development",
  "/free-sudit": "/free-audit",
};

export function proxy(request) {
  const destination = redirects[request.nextUrl.pathname];

  if (!destination) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(destination, request.url), 301);
}

export const config = {
  matcher: [
    "/aeo-services",
    "/seo-services",
    "/web-development",
    "/free-sudit",
  ],
};

import { NextResponse } from "next/server";
import { SITE_URL } from "./lib/seo-config";

const canonicalUrl = new URL(SITE_URL);

const redirects = {
  "/aeo-services": "/services/aeo-services",
  "/seo-services": "/services/seo-services",
  "/web-development": "/services/web-development",
};

export function proxy(request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const hostname = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (hostname === "klarai.uk" || (hostname === canonicalUrl.hostname && forwardedProto === "http")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = canonicalUrl.hostname;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const destination = redirects[request.nextUrl.pathname];

  if (!destination) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/((?!_next/static|_next/image).*)",
};

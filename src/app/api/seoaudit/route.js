import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const privateRanges = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^0\./,
];

function isPrivateAddress(address = "") {
  if (address === "::1") return true;
  if (address.startsWith("fc") || address.startsWith("fd") || address.startsWith("fe80:")) return true;
  return privateRanges.some((range) => range.test(address));
}

async function assertPublicUrl(value) {
  let url;
  try {
    url = new URL(String(value || "").trim());
  } catch {
    throw new Error("Enter a valid URL starting with http:// or https://.");
  }

  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http and https URLs can be audited.");
  if (!url.hostname || url.hostname === "localhost" || url.hostname.endsWith(".local")) throw new Error("Local URLs cannot be audited.");
  if (isIP(url.hostname) && isPrivateAddress(url.hostname)) throw new Error("Private network URLs cannot be audited.");

  const records = await lookup(url.hostname, { all: true });
  if (records.some((record) => isPrivateAddress(record.address))) throw new Error("Private network URLs cannot be audited.");

  return url;
}

export async function POST(request) {
  try {
    const { url: inputUrl } = await request.json();
    const url = await assertPublicUrl(inputUrl);

    let response;
    try {
      response = await fetch(url.href, {
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
        headers: {
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127 Safari/537.36",
          accept: "text/html,application/xhtml+xml",
        },
      });
    } catch (error) {
      const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
      return NextResponse.json({ error: timedOut ? "The site took too long to respond." : "Could not fetch that site. Try the full URL, including http:// or https://." }, { status: 502 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: `The site responded with ${response.status} ${response.statusText}.` }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      return NextResponse.json({ error: "The URL did not return an HTML page." }, { status: 400 });
    }

    const html = await response.text();
    if (html.trim().length < 30) {
      return NextResponse.json({ error: "The response contained no usable HTML." }, { status: 400 });
    }

    return NextResponse.json({ html, url: response.url || url.href });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Could not audit that URL." }, { status: 400 });
  }
}

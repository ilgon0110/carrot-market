import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.clone();
  url.pathname = "/enter";
  if (req.ua?.isBot) {
    return new Response(`Plz don't be a bot. Be human`, { status: 403 });
  }
  //middleware는 pages load때마다 실행되기 때문
  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.carrotsession) {
      return NextResponse.redirect(url);
    }
  }
}

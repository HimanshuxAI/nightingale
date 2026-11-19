import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { DEMO_COOKIE } from "./lib/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Demo mode: a single cookie unlocks the watch floor ────────────────────
  if (!CONFIGURED) {
    const demo = req.cookies.get(DEMO_COOKIE)?.value === "1";
    if (pathname.startsWith("/dashboard") && !demo) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // ── Supabase mode: refresh session cookies, guard the dashboard ───────────
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value, options } of list) {
          req.cookies.set(name, value);
          res.cookies.set(name, value, options);
        }
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*"],
};

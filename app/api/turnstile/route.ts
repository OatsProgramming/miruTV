import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
) {  
  const { turnstileResponse } = await req.json()

  const form = new URLSearchParams();
  form.append("secret", process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? '');
  form.append("response", turnstileResponse);
  form.append("remoteip", headers().get("x-forwarded-for") as string);

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form },
  );
  let json = await result.json();

  return NextResponse.json(json)
}

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const ref = body.orderReference;
  
    if (!ref) {
      return new Response('Missing order reference', { status: 400 });
    }
  
    return Response.redirect(`https://one-two-smile.vercel.app/shop/success?ref=${ref}`, 303);
  }
  
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');

  if (!ref) {
    return new Response('Missing order reference', { status: 400 });
  }

  return Response.redirect(`https://one-two-smile.vercel.app/shop/success?ref=${ref}`, 303);
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const ref = url.searchParams.get('ref');

  const successUrl = new URL('/shop/success', url.origin);
  if (ref) {
    successUrl.searchParams.set('ref', ref);
  }

  return NextResponse.redirect(successUrl.toString(), 303);
}

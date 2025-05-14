import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.redirect('https://one-two-smile.vercel.app/shop/success', 302);
}

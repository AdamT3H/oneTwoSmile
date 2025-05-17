import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 1. Розпарсити поточний URL
  const url = new URL(req.url);
  // 2. Витягнути ref
  const ref = url.searchParams.get('ref');

  // (тут можете за потреби щось зробити з ref — наприклад, записати в базу)

  // 3. Перенаправити на success з ref
  const successUrl = new URL('/shop/success', url.origin);
  if (ref) {
    successUrl.searchParams.set('ref', ref);
  }

  return NextResponse.redirect(successUrl.toString(), 303);
}

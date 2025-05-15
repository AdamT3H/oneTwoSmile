import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    amount,
    productName,
    productCount,
    productPrice,
    clientEmail,
    customerName,
    phone,
    deliveryInfo
  } = body;

  const merchantAccount = 'one_two_smile_com';
  const merchantDomainName = 'one-two-smile.com';
  const secretKey = process.env.WAYFORPAY_SECRET_KEY!;
  const orderReference = `ORDER-${Date.now()}`;
  const orderDate = Math.floor(Date.now() / 1000);
  const currency = 'UAH';

  // 1️⃣ ЗБЕРЕГТИ В SUPABASE
  const { error } = await supabase.from('orders').insert({
    order_reference: orderReference,
    order_date: new Date(orderDate * 1000),
    amount,
    currency,
    product_names: productName,
    product_counts: productCount,
    product_prices: productPrice,
    client_email: clientEmail,
    customer_name: customerName,
    phone,
    delivery_type: deliveryInfo.deliveryType,
    oblast_ref: deliveryInfo.oblastRef,
    city: deliveryInfo.city,
    status: 'pending',
  });

  if (error) {
    console.error('❌ Помилка при збереженні замовлення в базу:', error);
    return new Response('DB Error', { status: 500 });
  }

  const signatureSource = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate.toString(),
    amount.toString(),
    currency,
    ...productName,
    ...productCount.map((c: number) => c.toString()),
    ...productPrice.map((p: number) => p.toString())
  ].join(';');

  const merchantSignature = crypto
    .createHmac('md5', secretKey)
    .update(signatureSource)
    .digest('hex');

  const payload = {
    transactionType: 'CREATE_INVOICE',
    merchantAccount,
    merchantAuthType: 'SimpleSignature',
    merchantDomainName,
    merchantSignature,
    apiVersion: 1,
    language: 'UA',
    serviceUrl: 'https://one-two-smile.vercel.app/api/payment-callback',
    orderReference,
    orderDate,
    amount,
    currency,
    orderTimeout: 86400,
    productName,
    productCount,
    productPrice,
    clientEmail,
    returnUrl: 'https://one-two-smile.vercel.app/api/wayforpay-return',
  };

  const response = await fetch('https://api.wayforpay.com/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

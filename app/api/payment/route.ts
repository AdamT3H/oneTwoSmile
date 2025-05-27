import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

interface PaymentBody {
  amount: number;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  productId: number[];
  clientEmail: string;
  customerName: string;
  phone: string;
  paymentType: string;
  comment: string;
  deliveryInfo: {
    deliveryType: string;
    oblastName?: string | null;
    city?: string | null;
    warehouse?: string | null,
  };
}

export async function POST(req: NextRequest) {
  const body: PaymentBody = await req.json();

  const {
    amount,
    productName,
    productCount,
    productPrice,
    productId,
    clientEmail,
    customerName,
    phone,
    paymentType,
    comment,
    deliveryInfo
  } = body;

  const merchantAccount = 'one_two_smile_com';
  const merchantDomainName = 'one-two-smile.com';
  const secretKey = 'afbdff873acdd777b90ce1f79f294c25931db42a';
  const orderReference = `ORDER-${Date.now()}`;
  const orderDate = Math.floor(Date.now() / 1000);
  const currency = 'UAH';

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

  const { error } = await supabase.from('orders').insert({
    order_reference: orderReference,
    order_date: new Date(orderDate * 1000).toISOString(),
    amount,
    currency,
    product_names: productName,
    product_counts: productCount,
    product_prices: productPrice,
    product_ids: productId,
    client_email: clientEmail,
    customer_name: customerName,
    phone,
    paymentType,
    comment,
    delivery_type: deliveryInfo.deliveryType,
    oblast_name: deliveryInfo.oblastName,
    city: deliveryInfo.city,
    warehouse: deliveryInfo.warehouse,
    status: 'pending',
  });

  if (error) {
    console.error('❌ Помилка збереження в Supabase:', error.message);
    return new Response('Помилка збереження в базу', { status: 500 });
  }

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
    returnUrl: `https://one-two-smile.vercel.app/api/wayforpay-return?ref=${orderReference}`,
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

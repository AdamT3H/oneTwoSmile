import { NextRequest } from 'next/server';
import crypto from 'crypto';

interface PaymentBody {
  amount: number;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  clientEmail: string;
}

export async function POST(req: NextRequest) {
  const body: PaymentBody = await req.json();

  const {
    amount,
    productName,
    productCount,
    productPrice,
    clientEmail
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

  const payload = {
    transactionType: 'CREATE_INVOICE',
    merchantAccount,
    merchantAuthType: 'SimpleSignature',
    merchantDomainName,
    merchantSignature,
    apiVersion: 1,
    language: 'UA',
    // serviceUrl: 'http://localhost:3000/api/payment-callback', 
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
    // returnUrl: 'http://localhost:3000/shop/success',
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

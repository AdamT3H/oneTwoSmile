import { NextRequest, NextResponse } from 'next/server';
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

const MERCHANT_ACCOUNT = 'one_two_smile_com';
const MERCHANT_DOMAIN_NAME = 'onetwosmile.org';

export async function POST(req: NextRequest) {
  let body: PaymentBody;

  try {
    body = await req.json();
  } catch (err) {
    console.error("❌ Помилка при розборі JSON:", err);
    return NextResponse.json({ error: "Невірний JSON у запиті." }, { status: 400 });
  }

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

  const secretKey = process.env.WAYFORPAY_SECRET_KEY;

  if (!secretKey) {
    console.error("WAYFORPAY_SECRET_KEY is not set in environment variables");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const orderReference = `ORDER-${Date.now()}`;
  const orderDate = Math.floor(Date.now() / 1000);
  const currency = 'UAH';
  const origin = req.nextUrl.origin;

  const signatureSource = [
    MERCHANT_ACCOUNT,
    MERCHANT_DOMAIN_NAME,
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

  const wayForPayPayload = {
    transactionType: 'CREATE_INVOICE',
    merchantAccount: MERCHANT_ACCOUNT,
    merchantAuthType: 'SimpleSignature',
    merchantDomainName: MERCHANT_DOMAIN_NAME,
    merchantSignature,
    apiVersion: 1,
    language: 'UA',
    serviceUrl: 'https://www.onetwosmile.org/api/payment-callback',
    orderReference,
    orderDate,
    amount,
    currency,
    orderTimeout: 86400,
    productName,
    productCount,
    productPrice,
    clientEmail,
    returnUrl: `https://onetwosmile.org/api/wayforpay-return?ref=${orderReference}`,
  };

  let wayForPayData;
  try {
    const response = await fetch("https://api.wayforpay.com/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wayForPayPayload),
    });

    if (!response.ok) {
      throw new Error(`WayForPay API error: ${response.statusText}`);
    }

    wayForPayData = await response.json();

    if (!wayForPayData.invoiceUrl) {
      console.error("❌ WayForPay не повернув invoiceUrl:", wayForPayData);
      return NextResponse.json({ error: "Не вдалося створити рахунок на оплату." }, { status: 502 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ WayForPay request failed:", message);
    return NextResponse.json({ error: "Помилка звернення до платіжної системи." }, { status: 502 });
  }

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
  
  return NextResponse.json(wayForPayData, { status: 200 });
}

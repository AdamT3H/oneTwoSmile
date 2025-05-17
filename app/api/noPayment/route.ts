// app/api/noPayment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface NoPaymentBody {
  amount: number;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  productId: number[];
  clientEmail: string;
  customerName: string;
  phone: string;
  comment: string;
  deliveryInfo: {
    deliveryType: string;
    oblastName?: string | null;
    city?: string | null;
    warehouse?: string | null;
  };
}

export async function POST(req: NextRequest) {
  let body: NoPaymentBody;

  try {
    body = await req.json();
  } catch (err) {
  console.error("❌ Помилка при розборі JSON:", err);
  return NextResponse.json(
    { error: "Невірний JSON у запиті." },
    { status: 400 }
  );
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
    comment,
    deliveryInfo,
  } = body;

  const orderReference = uuidv4();
  const orderDate = new Date().toISOString();

  const { error } = await supabase.from("orders").insert({
    order_reference: orderReference,
    order_date: orderDate,
    amount,
    currency: "UAH",
    product_names: productName,
    product_counts: productCount,
    product_prices: productPrice,
    product_ids: productId,
    client_email: clientEmail,
    customer_name: customerName,
    phone,
    comment,
    delivery_type: deliveryInfo.deliveryType,
    oblast_name: deliveryInfo.oblastName ?? null,
    city: deliveryInfo.city ?? null,
    warehouse: deliveryInfo.warehouse ?? null,
    status: "have to pay",
  });

  if (error) {
    console.error("❌ Помилка збереження в Supabase:", error.message);
    return NextResponse.json(
      { error: "Помилка збереження в базу." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Замовлення прийнято в обробку.",
      orderReference,
    },
    { status: 200 }
  );
}

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
  paymentType: string;
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
    paymentType,
    comment,
    deliveryInfo,
  } = body;

  const orderReference = uuidv4();
  const orderDate = new Date().toISOString();

  const { error } = await supabase.from("orders").insert({
    order_reference: null,
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
    paymentType,
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

  try {
    const telegramRes = await fetch(
      "https://one-two-smile.vercel.app/api/telegramProductsToAdmin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          product_names: productName,
          product_counts: productCount,
          product_prices: productPrice,
          client_email: clientEmail,
          customer_name: customerName,
          phone,
          paymentType,
          comment,
          type: deliveryInfo.deliveryType,
          oblast_name: deliveryInfo.oblastName,
          city: deliveryInfo.city,
          warehouse: deliveryInfo.warehouse,
        }),
      }
    );

    if (!telegramRes.ok) {
      const errorText = await telegramRes.text();
      console.error(
        "❌ Помилка надсилання повідомлення в Telegram:",
        errorText
      );
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Telegram API fetch failed:", err.message);
    } else {
      console.error("❌ Telegram API fetch failed. Unknown error:", err);
    }
  }

  try {
    const emailRes = await fetch(
      "https://one-two-smile.vercel.app/api/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          productName,
          productCount,
          productPrice,
          clientEmail,
          clientName: customerName,
          phone,
          oblastNP: deliveryInfo.oblastName ?? "",
          cityNP: deliveryInfo.city ?? "",
          warehouseNP: deliveryInfo.warehouse ?? "",
        }),
      }
    );

    if (!emailRes.ok) {
      const errorText = await emailRes.text();
      console.error("❌ Помилка надсилання email:", errorText);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Email API fetch failed:", err.message);
    } else {
      console.error("❌ Email API fetch failed. Unknown error:", err);
    }
  }

  return NextResponse.json(
    {
      message: "Замовлення прийнято в обробку.",
      orderReference,
    },
    { status: 200 }
  );
}

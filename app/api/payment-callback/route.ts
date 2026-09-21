import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionStatus, orderReference } = body;

    if (transactionStatus !== "Approved") {
      return new Response("Ignored", { status: 200 });
    }

    console.log("✅ УСПІШНА ОПЛАТА — ОБРОБКА ЗАМОВЛЕННЯ", orderReference);

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_reference", orderReference)
      .single();

    if (error || !order) {
      console.error("❌ Не вдалося знайти замовлення в базі:", error);
      return new Response("Order not found", { status: 404 });
    }

    if (order.status === "paid") {
      console.warn(
        "⚠️ Замовлення вже оброблено — пропускаємо повторну обробку."
      );
      return new Response("Already processed", { status: 200 });
    }

    try {
      const emailPayload = {
        amount: order.amount,
        productName: order.product_names,
        productCount: order.product_counts,
        productPrice: order.product_prices,
        clientEmail: order.client_email,
        clientName: order.customer_name,
        phone: order.phone,
        oblastNP: order.oblast_name,
        cityNP: order.city,
        warehouseNP: order.warehouse,
      };

      const sendEmailRes = await fetch(
        `https://one-two-smile.vercel.app/api/sendEmail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        }
      );

      if (!sendEmailRes.ok) {
        const errorText = await sendEmailRes.text();
        console.error("❌ Помилка надсилання листа через API:", errorText);
      }
    } catch (err) {
      console.error("❌ Email fetch failed:", err);
    }

    try {
      await fetch(
        "https://one-two-smile.vercel.app/api/telegramProductsToAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: order.amount,
            product_names: order.product_names,
            product_counts: order.product_counts,
            product_prices: order.product_prices,
            client_email: order.client_email,
            customer_name: order.customer_name,
            phone: order.phone,
            paymentType: order.paymentType,
            comment: order.comment,
            type: order.delivery_type,
            oblast_name: order.oblast_name,
            city: order.city,
            warehouse: order.warehouse,
          }),
        }
      );
    } catch (err) {
      console.error("❌ Telegram fetch failed:", err);
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("order_reference", orderReference);

    if (updateError) {
      console.error("❌ Не вдалося оновити статус замовлення:", updateError);
      return new Response("DB update error", { status: 500 });
    }

    return new Response(JSON.stringify({ reason: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Помилка в callback:", error);
    return new Response("Server Error", { status: 500 });
  }
}

export async function GET() {
  return new Response("✅ Callback route is alive (GET)", { status: 200 });
}
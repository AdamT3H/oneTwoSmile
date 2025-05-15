import { NextRequest } from "next/server";
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionStatus, orderReference } = body;

    if (transactionStatus === "Approved") {
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
        console.warn("⚠️ Замовлення вже оброблено — пропускаємо повторну обробку.");
        return new Response("Already processed", { status: 200 });
      }

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
        warehouseNP: order.warehouse
      };

      const sendEmailRes = await fetch(`https://one-two-smile.vercel.app/api/sendEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      });

      if (!sendEmailRes.ok) {
        const errorText = await sendEmailRes.text();
        console.error("❌ Помилка надсилання листа через API:", errorText);
        return new Response("Email error", { status: 500 });
      }

      await fetch("https://one-two-smile.vercel.app/api/telegramProductsToAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 450,
          product_names: ["Товар A", "Товар B"],
          product_counts: [1, 2],
          product_prices: [200, 250],
          client_email: "client@example.com",
          customer_name: "Іван Іванович",
          phone: "+380991234567",
          oblast_name: "Львівська",
          city: "Львів",
          warehouse: "№17",
        }),
      });

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
    }

    return new Response("Ignored", { status: 200 });
  } catch (error) {
    console.error("❌ Помилка в callback:", error);
    return new Response("Server Error", { status: 500 });
  }
}

export async function GET() {
  return new Response("✅ Callback route is alive (GET)", { status: 200 });
}


// import { NextRequest } from 'next/server';

// export async function POST(req: NextRequest) {
//   const body = await req.json();

//   const {
//     transactionStatus,
//     // orderReference,
//     // amount,
//     // email,
//     // та інші поля, які надсилає WayForPay
//   } = body;

//   if (transactionStatus === 'Approved') {

//     // 2. Надіслати повідомлення адміну в Telegram
//     // await notifyAdminInTelegram(orderReference, amount, email);

//     // 3. Очистити корзину користувача (якщо є авторизація)
//     // 4. Оновити склад (зменшити кількість товарів)

//     console.log("НАДСИЛАЮ НА ПОШТУ БІБІ БА БА")

//     return new Response(JSON.stringify({ reason: "Success" }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }

//   return new Response("Ignored", { status: 200 });
// }

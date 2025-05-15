import { NextRequest } from "next/server";
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { transactionStatus, orderReference } = body;
    console.log("HHH!!!", body);

    if (transactionStatus === "Approved") {
      console.log("✅ УСПІШНА ОПЛАТА — НАДСИЛАЮ EMAIL!", orderReference);

    //   const { data: order, error } = await supabase
    //     .from("orders")
    //     .select("*")
    //     .eq("order_reference", orderReference)
    //     .single();

    //   if (error || !order) {
    //     console.error("❌ Не вдалося знайти замовлення в базі:", error);
    //     return new Response("Order not found", { status: 404 });
    //   }

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
//     // 1. Надіслати листа клієнту
//     // await sendEmailToClient(email, orderReference, amount);

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

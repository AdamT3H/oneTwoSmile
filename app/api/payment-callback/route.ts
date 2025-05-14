import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { transactionStatus } = body;

  if (transactionStatus === "Approved") {
    console.log("НАДСИЛАЮ НА ПОШТУ БІБІ БА БА");
    return new Response(JSON.stringify({ reason: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Ignored", { status: 200 });
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

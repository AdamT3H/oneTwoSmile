import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

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
        console.warn(
          "⚠️ Замовлення вже оброблено — пропускаємо повторну обробку."
        );
        return new Response("Already processed", { status: 200 });
      }

      const productIds: number[] = order.product_ids;
      const productCounts: number[] = order.product_counts;

      if (
        !productIds ||
        !productCounts ||
        productIds.length !== productCounts.length
      ) {
        console.error("❌ Неправильні дані product_ids або product_counts");
        return new Response("Invalid product data", { status: 400 });
      }

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, in_stock")
        .in("id", productIds);

      if (productsError || !products) {
        console.error("❌ Не вдалося отримати продукти:", productsError);
        return new Response("Products fetch error", { status: 500 });
      }

      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const countToSubtract = productCounts[i];

        const product = products.find((p) => p.id === productId);
        if (!product) {
          console.warn(`⚠️ Продукт з id ${productId} не знайдено — пропуск`);
          continue;
        }

        const newInStock = product.in_stock - countToSubtract;
        if (newInStock < 0) {
          console.warn(
            `⚠️ Продукт ${productId} має недостатній запас — залишилось ${product.in_stock}, потрібно ${countToSubtract}`
          );
          // Можеш або зупинити обробку, або поставити 0:
          return new Response("Not enough stock", { status: 400 });
        }

        const { error: updateProductError } = await supabase
          .from("products")
          .update({ in_stock: newInStock >= 0 ? newInStock : 0 })
          .eq("id", productId);

        if (updateProductError) {
          console.error(
            `❌ Помилка оновлення продукту ${productId}:`,
            updateProductError
          );
          return new Response("Stock update error", { status: 500 });
        }
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
        return new Response("Email error", { status: 500 });
      }

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
            comment: order.comment,
            type: order.delivery_type,
            oblast_name: order.oblast_name,
            city: order.city,
            warehouse: order.warehouse,
          }),
        }
      );

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

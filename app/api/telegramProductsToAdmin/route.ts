const TELEGRAM_TOKEN = "7375273017:AAHvLfUOnqo9rCmc8q5yTbLxQE5r0y-Eh3c";
const TELEGRAM_CHAT_ID = "818686269";

interface PaymentBody {
  amount: number;
  product_names: string[];
  product_counts: number[];
  product_prices: number[];
  client_email: string;
  customer_name: string;
  phone: string;
  comment: string;
  type: string;
  oblast_name: string;
  city: string;
  warehouse: string;
  paymentType: "card" | "paper"; // додано
}

async function sendTelegramMessage(order: PaymentBody) {
  const { product_names, product_counts, product_prices } = order;

  const formattedGoods = product_names
    .map((name, index) => {
      return (
        `      📦 Товар ${index + 1}:\n` +
        `              Назва: ${name}\n` +
        `              Кількість: ${product_counts[index]}\n` +
        `              Ціна: ${product_prices[index]} ₴\n\n`
      );
    })
    .join("");

  const deliveryText =
    order.type === "nova_poshta"
      ? `🚚 Доставка: Нова Пошта\nОбласть: ${order.oblast_name}\nМісто: ${order.city}\nВідділення: ${order.warehouse}`
      : `🚚 Доставка: Заберуть у фізичному магазині`;

  const paymentText =
    order.paymentType === "card"
      ? "💳 Оплата: Оплачено"
      : "💳 Оплата: Має оплатити при отриманні";

  const message =
    `🛒 НОВЕ ЗАМОВЛЕННЯ:\n\n` +
    `👤 Ім'я: ${order.customer_name || "Невідомо"}\n` +
    `📧 Email: ${order.client_email || "Невідомо"}\n` +
    `📞 Телефон: ${order.phone || "Невідомо"}\n` +
    (order.comment ? `📝 Коментар: ${order.comment}\n` : "") +
    `${paymentText}\n\n` +
    `${deliveryText}\n` +
    `🛍️ Товари:\n${formattedGoods}\n` +
    `💰 Кінцева сума: ${order.amount} ₴`;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "Markdown",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Telegram помилка:", text);
    throw new Error("Telegram error: " + text);
  }
}

export async function POST(request: Request) {
  try {
    const body: PaymentBody = await request.json();
    await sendTelegramMessage(body);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    return new Response(JSON.stringify({ success: false, message }), {
      status: 500,
    });
  }
}

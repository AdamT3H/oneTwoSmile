interface TelegramOrderPayload {
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
  paymentType: "card" | "paper";
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

async function sendTelegramMessage(order: TelegramOrderPayload) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error("Telegram token or chat id is not set");
  }
  
  const { product_names, product_counts, product_prices } = order;

  if (product_names.length !== product_counts.length || product_names.length !== product_prices.length) {
    throw new Error("Product arrays length mismatch");
  }
  
  const formattedGoods = product_names
    .map((name, index) => {
      return (
        `      📦 Товар ${index + 1}:\n` +
        `              Назва: ${escapeMarkdown(name)}\n` +
        `              Кількість: ${product_counts[index]}\n` +
        `              Ціна: ${product_prices[index]} ₴\n\n`
      );
    })
    .join("");

  const deliveryText =
    order.type === "nova_poshta"
      ? `🚚 Доставка: Нова Пошта\nОбласть: ${escapeMarkdown(order.oblast_name)}\nМісто: ${escapeMarkdown(order.city)}\nВідділення: ${escapeMarkdown(order.warehouse)}`
      : `🚚 Доставка: Заберуть у фізичному магазині`;

  const paymentText =
    order.paymentType === "card"
      ? "💳 Оплата: Оплачено"
      : "💳 Оплата: Має оплатити при отриманні";

  const message =
    `🛒 НОВЕ ЗАМОВЛЕННЯ:\n\n` +
    `👤 Ім'я: ${escapeMarkdown(order.customer_name) || "Невідомо"}\n` +
    `📧 Email: ${escapeMarkdown(order.client_email) || "Невідомо"}\n` +
    `📞 Телефон: ${escapeMarkdown(order.phone) || "Невідомо"}\n` +
    (order.comment ? `📝 Коментар: ${escapeMarkdown(order.comment)}\n` : "") +
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
    const body: TelegramOrderPayload = await request.json();

    await sendTelegramMessage(body);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    console.error("❌ sendTelegramMessage error:", message);

    return new Response(
      JSON.stringify({
        success: false,
        message,
      }),
      { status: 500 }
    );
  }
}

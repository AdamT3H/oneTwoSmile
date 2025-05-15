
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
  oblast_name: string;
  city: string;
  warehouse: string;
}

export async function sendTelegramMessage(order: PaymentBody) {
  const { product_names, product_counts, product_prices } = order;

  const formattedGoods = product_names.map((name, index) => {
    return (
      `      📦 Товар ${index + 1}:\n` +
      `              Назва: ${name}\n` +
      `              Кількість: ${product_counts[index]}\n` +
      `              Ціна: ${product_prices[index]} ₴\n\n`
    );
  }).join("");

  const message =
    `🛒 НОВЕ ЗАМОВЛЕННЯ:\n\n` +
    `👤 Ім'я: ${order.customer_name || "Невідомо"}\n` +
    `📧 Email: ${order.client_email || "Невідомо"}\n` +
    `📞 Телефон: ${order.phone || "Невідомо"}\n` +
    `🌍 Область: ${order.oblast_name || "Невідомо"}\n` +
    `🏙️ Місто: ${order.city || "Невідомо"}\n` +
    `🏤 Відділення: ${order.warehouse || "Невідомо"}\n` +
    `💳 Оплата: Оплачено\n\n` +
    `🛍️ Товари:\n${formattedGoods}\n` +
    `💰 Кінцева сума: ${order.amount} ₴`;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "Markdown"
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Telegram помилка:", text);
  }
}

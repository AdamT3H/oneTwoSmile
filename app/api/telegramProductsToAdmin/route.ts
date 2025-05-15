
const TELEGRAM_TOKEN = "7375273017:AAHvLfUOnqo9rCmc8q5yTbLxQE5r0y-Eh3c";
const TELEGRAM_CHAT_ID = "818686269";

export async function sendTelegramMessage(order: any) {
  const productNames = order.product_names;
  const productCounts = order.product_counts;
  const productPrices = order.product_prices;

  const formattedGoods = productNames.map((name: string, index: number) => {
    return (
      `      📦 Товар ${index + 1}:\n` +
      `              Назва: ${name}\n` +
      `              Кількість: ${productCounts[index]}\n` +
      `              Ціна: ${productPrices[index]} ₴\n\n`
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

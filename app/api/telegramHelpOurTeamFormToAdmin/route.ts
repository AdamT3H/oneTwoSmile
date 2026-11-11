interface HelpOurTeamPayload {
  phone: string;
  name?: string;
  comment?: string;
  contactMethod: string;
}

export async function POST(request: Request) {
  try {
    const {phone, name, comment, contactMethod}: HelpOurTeamPayload = await request.json();

    if (!phone?.trim()) {
      return Response.json(
        { success: false, message: "Phone is required" },
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      throw new Error("Telegram token or chat id is not set");
    }

    const text =
      `📞 НОВА ЗАЯВКА (підбір лікаря)\n\n` +
      `Телефон: ${phone.trim().slice(0, 30)}\n` +
      `Ім'я: ${name?.trim().slice(0, 100) || "Не вказано"}\n` +
      `Коментар: ${comment?.trim().slice(0, 1000) || "Не вказано"}\n` +
      `Метод звʼязку: ${contactMethod?.trim().slice(0, 1000)}`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({chat_id: chatId, text, parse_mode: "Markdown"}),
    });

    if (!res.ok) throw new Error("Telegram error: " + (await res.text()));

    return Response.json({success: true}, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("helpOurTeamPayload error:", message);
    return Response.json({ success: false, message }, { status: 500 });
  }
}
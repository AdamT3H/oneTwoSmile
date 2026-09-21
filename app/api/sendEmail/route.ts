import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

interface SendEmailBody {
  amount: number;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  clientEmail: string;
  clientName: string;
  phone: string,
  oblastNP: string,
  cityNP: string,
  warehouseNP: string,
}

function escapeHtml(value: string): string {
  return value.replace(/[<>&"]/g, (char) => {
    switch (char) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case '"': return "&quot;";
      default: return char;
    }
  });
}

export async function POST(req: NextRequest) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPassword) {
    console.error("Gmail credentials are not set in environment variables");
    return new Response("Server configuration error", { status: 500 });
  }

  let body: SendEmailBody;
  try {
    body = await req.json();
  } catch (err) {
    console.error("❌ Помилка при розборі JSON:", err);
    return new Response("Invalid JSON", { status: 400 });
  }

  const { amount, productName, productCount, productPrice, clientEmail, clientName, phone, oblastNP, cityNP, warehouseNP } = body;

  if (!clientEmail) {
    console.error("❌ Немає clientEmail!");
    return new Response("Missing clientEmail", { status: 400 });
  }

  if (productName.length !== productCount.length || productName.length !== productPrice.length) {
    console.error("❌ Масиви товарів різної довжини");
    return new Response("Invalid product data", { status: 400 });
  }

  try {
    const productList = productName
      .map((name, index) => {
        const count = productCount[index];
        const price = productPrice[index];
        return `<li><b>${name}</b>: ${count} x ₴${price}</li>`;
      })
      .join("");

      const htmlBody = `
      <div style="background: #f0f2f5; padding: 40px 20px; font-family: 'Arial', sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 40px 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #222; font-size: 24px;">Дякуємо за ваше замовлення, ${escapeHtml(clientName)}!</h2>
          </div>

          <p style="font-size: 16px; margin-bottom: 10px;">Ви придбали наступні товари:</p>
          <ul style="padding-left: 20px; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
            ${productList}
          </ul>

          <p style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">Сума замовлення: ₴${amount}</p>

          <div style="font-size: 16px; margin-bottom: 20px;">
            <p><b>Номер телефону:</b> ${escapeHtml(phone)}</p>
            <p><b>Email:</b> ${escapeHtml(clientEmail)}</p>
            <p><b>Область:</b> ${escapeHtml(oblastNP)}</p>
            <p><b>Місто:</b> ${escapeHtml(cityNP)}</p>
            <p><b>Відділення Нової Пошти:</b> ${escapeHtml(warehouseNP)}</p>
          </div>

          <p style="font-size: 16px;">Очікуйте підтвердження доставки. Гарного дня!</p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 12px; color: #888; text-align: center;">Цей лист сформовано автоматично. Якщо ви не робили замовлення — просто проігноруйте його.</p>
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    const result = await transporter.sendMail({
      from: `"One Two Smile Shop" <onetwosmileshop@gmail.com>`,
      to: clientEmail,
      subject: "Ваше замовлення оформлено!",
      html: htmlBody,
    });

    console.log("✅ Лист надіслано:", result);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ ПОМИЛКА ВНУТРІШНЯ В /send-email:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

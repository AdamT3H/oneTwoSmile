import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

interface PaymentBody {
  amount: number;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  clientEmail: string;
  clientName: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentBody = await req.json();

    const { amount, productName, productCount, productPrice, clientEmail, clientName } =
      body;

    if (!clientEmail) {
      console.error("❌ Немає clientEmail!");
      return new Response("Missing clientEmail", { status: 400 });
    }

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
            <h2 style="color: #222; font-size: 24px;">Дякуємо за ваше замовлення, ${clientName}!</h2>
          </div>
    
          <p style="font-size: 16px; margin-bottom: 10px;">Ви придбали наступні товари:</p>
          <ul style="padding-left: 20px; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
            ${productList}
          </ul>
    
          <p style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">Сума замовлення: ₴${amount}</p>
    
          <p style="font-size: 16px;">Очікуйте підтвердження доставки. Гарного дня!</p>
    
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
    
          <p style="font-size: 12px; color: #888; text-align: center;">Цей лист сформовано автоматично. Якщо ви не робили замовлення — просто проігноруйте його.</p>
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "onetwosmileshop@gmail.com",
        pass: "xsxj awdx xspp xbqw",
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

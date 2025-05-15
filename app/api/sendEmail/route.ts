import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

interface PaymentBody {
  amount: number;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  clientEmail: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentBody = await req.json();

    const { amount, productName, productCount, productPrice, clientEmail } =
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
      <div style="background-image: url('https://onetwosmileshop.com/header/bg.png'); background-size: cover; padding: 40px 20px; font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center;">
            <img src="https://onetwosmileshop.com/header/logo.png" alt="One Two Smile Shop" style="max-width: 150px; margin-bottom: 20px;" />
            <h2 style="color: #333;">Дякуємо за ваше замовлення!</h2>
          </div>
          <p>Ви придбали наступні товари:</p>
          <ul style="padding-left: 20px;">
            ${productList}
          </ul>
          <p><strong>Сума замовлення:</strong> ₴${amount}</p>
          <p>Очікуйте підтвердження доставки. Гарного дня!</p>
          <hr style="margin-top: 30px;" />
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

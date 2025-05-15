import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

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
  
      const { amount, productName, productCount, productPrice, clientEmail } = body;
  
      if (!clientEmail) {
        console.error("❌ Немає clientEmail!");
        return new Response("Missing clientEmail", { status: 400 });
      }
  
      const productList = productName.map((name, index) => {
        const count = productCount[index];
        const price = productPrice[index];
        return `<li><b>${name}</b>: ${count} x ₴${price}</li>`;
      }).join('');
  
      const htmlBody = `
        <h2>Дякуємо за ваше замовлення!</h2>
        <p>Ви придбали наступні товари:</p>
        <ul>
          ${productList}
        </ul>
        <p><strong>Сума замовлення:</strong> ₴${amount}</p>
        <p>Очікуйте підтвердження доставки. Гарного дня!</p>
      `;
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "onetwosmileshop@gmail.com",
          pass: "xsxj awdx xspp xbqw", 
        },
      });
  
      const result = await transporter.sendMail({
        from: `"One Two Smile Shop" <itstepmerch@gmail.com>`,
        to: clientEmail,
        subject: 'Ваше замовлення оформлено!',
        html: htmlBody,
      });
  
      console.log("✅ Лист надіслано:", result);
  
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("❌ ПОМИЛКА ВНУТРІШНЯ В /send-email:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  
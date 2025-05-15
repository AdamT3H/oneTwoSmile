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
        user: "itstepmerch@gmail.com",       // Gmail адреса
        pass: "qhsb jomd wubz jadw",    // App Password
      },
    });

    await transporter.sendMail({
      from: `"Step Merch"`,
      to: clientEmail,
      subject: 'Ваше замовлення оформлено',
      html: htmlBody,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Помилка надсилання листа:', error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}

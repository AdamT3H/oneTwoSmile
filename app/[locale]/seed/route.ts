import { db } from '@vercel/postgres';

const client = await db.connect();

const clinic = [
  { 
    name: 'One Two Smile',
    email: 'one.two.smile.dentistry@gmail.com',
    phone: '+380974774749',
    location: 'Україна, м.Львів, вул.Замарстинівська,127 (ЖК барселона)',
    workTime: {
      weekdays: 'ПТ-ПН 9:00-21:00',
      weekends: 'CБ 10:00-17:00'
    }
  }
];

async function seedClinicInfo() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS clinicInfo (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      work_time_weekdays TEXT NOT NULL,
      work_time_weekends TEXT NOT NULL
    );
  `;

  const insertedClinicInfo = await Promise.all(
    clinic.map(async (clinic) => {
      return client.sql`
        INSERT INTO clinicInfo (name, email, phone, location, work_time_weekdays, work_time_weekends)
        VALUES (${clinic.name}, ${clinic.email}, ${clinic.phone}, ${clinic.location}, ${clinic.workTime.weekdays}, ${clinic.workTime.weekends})
        ON CONFLICT (email) DO NOTHING;
      `;
    }),
  );

  return insertedClinicInfo;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedClinicInfo();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error: unknown) {
    // Перевіряємо, чи є помилка об'єктом і чи має вона властивість message
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    } else {
      return Response.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = "https://api.novaposhta.ua/v2.0/json/";

  const { searchParams } = new URL(req.url);
  const RefOblast = searchParams.get("RefOblast");
  const InputByUser_City = searchParams.get("InputByUser_City");

  const apiKey = process.env.NOVA_POSHTA_API_KEY;
  if (!apiKey) {
    throw new Error("NOVA_POSHTA_API_KEY is not set");
  }

  if (!RefOblast || !InputByUser_City) {
    return NextResponse.json({ error: "Missing RefOblast or InputByUser_City" }, { status: 400 });
  }

  const payload = {
    apiKey: apiKey,
    modelName: "AddressGeneral",
    calledMethod: "getSettlements",
    methodProperties: {
      AreaRef: RefOblast,
      FindByString: InputByUser_City,
      Limit: "100"
    }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Nova Poshta API error: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data.data || []);
  } catch (error: unknown) {
    let message = "Unknown error";
  
    if (error instanceof Error) {
      message = error.message;
    }
  
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

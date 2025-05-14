import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = "https://api.novaposhta.ua/v2.0/json/";

  const { searchParams } = new URL(req.url);
  const RefOblast = searchParams.get("RefOblast");
  const InputByUser_City = searchParams.get("InputByUser_City");

  if (!RefOblast || !InputByUser_City) {
    return NextResponse.json({ error: "Missing RefOblast or InputByUser_City" }, { status: 400 });
  }

  const payload = {
    apiKey: "500447b630d641ac4fc37354a781ae1e",
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

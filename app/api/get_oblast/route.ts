import { NextResponse } from "next/server";

export async function GET() {
  const url = "https://api.novaposhta.ua/v2.0/json/";

  const payload = {
    apiKey: "500447b630d641ac4fc37354a781ae1e",
    modelName: "AddressGeneral",
    calledMethod: "getSettlementAreas",
    methodProperties: {
      Ref: ""
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
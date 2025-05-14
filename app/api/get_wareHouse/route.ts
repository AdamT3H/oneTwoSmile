import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nameCity = searchParams.get("nameCity");
  const InputByUser_House = searchParams.get("InputByUser_House");

  if (!nameCity) {
    return NextResponse.json(
      { error: "Missing required parameter: nameCity" },
      { status: 400 }
    );
  }

  const url = "https://api.novaposhta.ua/v2.0/json/";

  const payload = {
    apiKey: "500447b630d641ac4fc37354a781ae1e",
    modelName: "AddressGeneral",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityName: nameCity,
      Limit: "150",
      Language: "UA",
      ...(InputByUser_House && { FindByString: InputByUser_House }) 
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

import { NextRequest, NextResponse } from "next/server";
import { callNovaPoshta } from "@/lib/novaPoshta";

interface City {
  Ref: string;
  Description: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const refOblast = searchParams.get("RefOblast");
  const inputByUserCity = searchParams.get("InputByUser_City");

  if (!refOblast || !inputByUserCity) {
    return NextResponse.json({ error: "Missing RefOblast or InputByUser_City" }, { status: 400 });
  }

  try {
    const cities = await callNovaPoshta<City>({
      modelName: "AddressGeneral",
      calledMethod: "getSettlements",
      methodProperties: {
        AreaRef: refOblast,
        FindByString: inputByUserCity,
        Limit: "100",
      },
    });

    return NextResponse.json(cities);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("get_city error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
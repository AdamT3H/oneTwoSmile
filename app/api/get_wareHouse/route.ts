import { NextResponse } from "next/server";
import { callNovaPoshta } from "@/lib/novaPoshta";

interface Warehouse {
  SiteKey: string;
  Description: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nameCity = searchParams.get("nameCity");
  const inputByUserHouse = searchParams.get("InputByUser_House");

  if (!nameCity) {
    return NextResponse.json({ error: "Missing required parameter: nameCity" }, { status: 400 });
  }

  try {
    const warehouses = await callNovaPoshta<Warehouse>({
      modelName: "AddressGeneral",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityName: nameCity,
        Limit: "150",
        Language: "UA",
        ...(inputByUserHouse && { FindByString: inputByUserHouse }),
      },
    });

    return NextResponse.json(warehouses);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("get_wareHouse error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { callNovaPoshta } from "@/lib/novaPoshta";

interface Oblast {
  Ref: string;
  Description: string;
}

export async function GET() {
  try {
    const oblasts = await callNovaPoshta<Oblast>({
      modelName: "AddressGeneral",
      calledMethod: "getSettlementAreas",
      methodProperties: {
        Ref: "",
      },
    });

    return NextResponse.json(oblasts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("get_oblast error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
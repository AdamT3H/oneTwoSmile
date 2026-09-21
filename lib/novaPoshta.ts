const NOVA_POSHTA_URL = "https://api.novaposhta.ua/v2.0/json/";

interface NovaPoshtaRequest {
  modelName: string;
  calledMethod: string;
  methodProperties: Record<string, string>;
}

export async function callNovaPoshta<T>(request: NovaPoshtaRequest): Promise<T[]> {
  const apiKey = process.env.NOVA_POSHTA_API_KEY;
  if (!apiKey) {
    throw new Error("NOVA_POSHTA_API_KEY is not set");
  }

  const res = await fetch(NOVA_POSHTA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, ...request }),
  });

  if (!res.ok) {
    throw new Error(`Nova Poshta API error: ${res.statusText}`);
  }

  const data = await res.json();

  if (data.errors && data.errors.length > 0) {
    console.error("Nova Poshta API errors:", data.errors);
    throw new Error("Nova Poshta API returned errors");
  }

  return Array.isArray(data.data) ? data.data : [];
}
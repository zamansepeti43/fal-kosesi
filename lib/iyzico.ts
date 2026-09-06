import crypto from "node:crypto";

const IYZICO_API_URL = process.env.IYZICO_API_URL || "https://api.iyzipay.com";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} ortam değişkeni eksik`);
  return value;
}

export function createIyzicoAuthorization(path: string, body: string) {
  const apiKey = requireEnv("IYZICO_API_KEY");
  const secretKey = requireEnv("IYZICO_SECRET_KEY");
  const randomKey = `${Date.now()}${crypto.randomInt(100000, 999999)}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(`${randomKey}${path}${body}`)
    .digest("hex");
  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  return {
    authorization: `IYZWSv2 ${Buffer.from(authorizationString, "utf8").toString("base64")}`,
    randomKey,
  };
}

export async function iyzicoPost<T>(path: string, payload: unknown): Promise<T> {
  const body = JSON.stringify(payload);
  const { authorization, randomKey } = createIyzicoAuthorization(path, body);
  const response = await fetch(`${IYZICO_API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "x-iyzi-rnd": randomKey,
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as T & { status?: string; errorMessage?: string };
  if (!response.ok || data?.status === "failure") {
    throw new Error(data?.errorMessage || `iyzico isteği başarısız (${response.status})`);
  }
  return data;
}

export function iyzicoBaseUrl() {
  return IYZICO_API_URL;
}

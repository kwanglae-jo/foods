const SESSION_VALUE = "admin-authenticated";
export const SESSION_COOKIE = "admin_session";

async function hmac(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  return Boolean(
    validUser && validPass && username === validUser && password === validPass
  );
}

export async function createSessionToken(): Promise<string> {
  return hmac(process.env.ADMIN_PASSWORD ?? "", SESSION_VALUE);
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const expected = await hmac(process.env.ADMIN_PASSWORD, SESSION_VALUE);
  return token === expected;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getBaseHeaders() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
  };
}

async function parseError(response: Response) {
  const text = await response.text();

  if (!text) {
    return `${response.status} ${response.statusText}`;
  }

  try {
    const payload = JSON.parse(text) as { message?: string };
    return payload.message ?? text;
  } catch {
    return text;
  }
}

export async function supabaseRest<T>(
  path: string,
  options?: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    query?: Record<string, string>;
    body?: unknown;
    allowEmpty?: boolean;
    single?: boolean;
  }
) {
  if (!SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  const url = new URL(`/rest/v1/${path}`, SUPABASE_URL);

  for (const [key, value] of Object.entries(options?.query ?? {})) {
    url.searchParams.set(key, value);
  }

  const headers = new Headers(getBaseHeaders());
  headers.set("Content-Type", "application/json");

  if (options?.single) {
    headers.set("Accept", "application/vnd.pgrst.object+json");
  }

  if (options?.method && options.method !== "GET") {
    headers.set("Prefer", "return=representation");
  }

  const response = await fetch(url, {
    method: options?.method ?? "GET",
    headers,
    body: options?.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store"
  });

  if (!response.ok) {
    if (options?.allowEmpty && (response.status === 404 || response.status === 406)) {
      return null;
    }

    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function supabaseRpc<T>(
  fn: string,
  body?: Record<string, unknown>,
  options?: { allowEmpty?: boolean; single?: boolean }
) {
  return supabaseRest<T>(`rpc/${fn}`, {
    method: "POST",
    body,
    allowEmpty: options?.allowEmpty,
    single: options?.single
  });
}

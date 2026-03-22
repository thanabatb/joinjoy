import fs from "node:fs";
import path from "node:path";

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf8");
  const entries = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    entries[key] = value;
  }

  return entries;
}

function loadEnv() {
  const cwd = process.cwd();
  const merged = {
    ...readEnvFile(path.join(cwd, ".env")),
    ...readEnvFile(path.join(cwd, ".env.local")),
    ...process.env
  };

  return {
    supabaseUrl: merged.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: merged.SUPABASE_SERVICE_ROLE_KEY
  };
}

function getArgs() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const prefixArg = args.find((arg) => arg.startsWith("--prefix="));
  const prefix = prefixArg ? prefixArg.slice("--prefix=".length) : process.env.TEST_EVENT_PREFIX || "PW";

  return { apply, prefix };
}

async function supabaseRequest(url, serviceRoleKey, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function main() {
  const { apply, prefix } = getArgs();
  const { supabaseUrl, serviceRoleKey } = loadEnv();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  }

  const listUrl = new URL("/rest/v1/events", supabaseUrl);
  listUrl.searchParams.set("select", "id,share_token,title,created_at");
  listUrl.searchParams.set("title", `ilike.${prefix}*`);
  listUrl.searchParams.set("order", "created_at.desc");

  const rows = (await supabaseRequest(listUrl, serviceRoleKey)) ?? [];

  if (!rows.length) {
    console.log(`No test events found for prefix "${prefix}".`);
    return;
  }

  console.log(`${apply ? "Deleting" : "Found"} ${rows.length} event(s) with prefix "${prefix}":`);

  for (const row of rows) {
    console.log(`- ${row.title} (${row.share_token})`);
  }

  if (!apply) {
    console.log('Dry run only. Re-run with "--apply" to delete these events.');
    return;
  }

  const deleteUrl = new URL("/rest/v1/events", supabaseUrl);
  deleteUrl.searchParams.set("title", `ilike.${prefix}*`);

  await supabaseRequest(deleteUrl, serviceRoleKey, {
    method: "DELETE",
    headers: {
      Prefer: "return=representation"
    }
  });

  console.log("Cleanup complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

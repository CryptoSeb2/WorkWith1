export const SHEETS_LOG_URL = "https://script.google.com/macros/s/AKfycby-lltNLUgoL3fX3DatNtAFeHZ51wHqDZijHJUPI8hAt5f6k_nvue5vUhs4reaLXXmb/exec";
export const SHEETS_LOG_SECRET = "SAME_SECRET_YOU_USED_IN_APPS_SCRIPT";

export async function logToSheets(payload) {
  const body = new URLSearchParams({
    ...payload,
    key: SHEETS_LOG_SECRET
  });

  // IMPORTANT: do NOT set custom headers (avoids CORS/preflight issues)
  await fetch(SHEETS_LOG_URL, {
    method: "POST",
    body
  });
}


// js/confirm-task.js
const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

const params = new URLSearchParams(window.location.search);

const taskIdEl = document.getElementById("task_id");
const posterUidEl = document.getElementById("poster_uid");
const posterEmailEl = document.getElementById("poster_email");

if (taskIdEl) taskIdEl.value = params.get("task_id") || "";
if (posterUidEl) posterUidEl.value = params.get("poster_uid") || "";
if (posterEmailEl) posterEmailEl.value = params.get("poster_email") || "";

const form = document.getElementById("confirmForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = new URLSearchParams({
    task_id: document.getElementById("task_id")?.value || "",
    poster_uid: document.getElementById("poster_uid")?.value || "",
    poster_email: document.getElementById("poster_email")?.value || "",
    worker_name: document.getElementById("worker_name")?.value || "",
    worker_email: document.getElementById("worker_email")?.value || "",
    worker_phone: document.getElementById("worker_phone")?.value || "",
    note: document.getElementById("note")?.value || ""
  });

  const res = await fetch(SCRIPT_URL + "?action=logconfirmation", {
    method: "POST",
    body
  });

  const data = await res.json();
  console.log("confirm response:", data);

  if (data.ok) {
    alert("Confirmed! ✅");
    form.reset();
    window.location.href = "tasks.html";
  } else {
    alert("Confirm failed: " + (data.error || "unknown error"));
  }
});

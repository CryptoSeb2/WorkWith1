const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby8d77IHsxtpdSjrm5wl0D1u5KSzmqtzXjN4I4U7ECNVW30bdLzXvj-T_qWap84EIE/exec"; // the /exec URL

const SECRET = "workwith_secret_12345"; // must match Apps Script SECRET exactly

console.log("confirm-task.js loaded ✅");

const form = document.getElementById("confirmForm");
if (!form) console.error("confirmForm not found");

const params = new URLSearchParams(window.location.search);

function setVal(id, v) {
  const el = document.getElementById(id);
  if (el) el.value = v || "";
}

// Fill hidden fields from URL params (these MUST be in the confirm link)
setVal("task_id", params.get("task_id"));
setVal("poster_uid", params.get("poster_uid"));
setVal("poster_email", params.get("poster_email"));

// Optional: if you added worker_uid hidden field, fill it from url too
setVal("worker_uid", params.get("worker_uid"));
import { auth } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    setVal("worker_uid", user.uid);
  }
});


form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("submit clicked ✅");

  // IMPORTANT: your HTML screenshot shows NO input with id="note"
  // so we read note safely (and send empty if not present)
  const noteEl = document.getElementById("note");

  const body = new URLSearchParams({
  key: SECRET,
  action: "logconfirmation",
  task_id: document.getElementById("task_id")?.value || "",
  poster_uid: document.getElementById("poster_uid")?.value || "",
  poster_email: document.getElementById("poster_email")?.value || "",

 worker_name: document.getElementById("worker_name")?.value || "",
worker_email: document.getElementById("worker_email")?.value || "",
worker_phone: document.getElementById("worker_phone")?.value || "",

});

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body,
    });

    const data = await res.json();
    console.log("server response:", data);

    if (data.ok) {
      alert("Confirmed! ✅");
      form.reset();
      window.location.href = "tasks.html";
    } else {
      alert("Confirm failed: " + (data.error || "unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error: " + err.message);
  }
});


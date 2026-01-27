const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8d77IHsxtpdSjrm5wl0D1u5KSzmqtzXjN4I4U7ECNVW30bdLzXvj-T_qWap84EIE/exec";

console.log("confirm-task.js loaded ✅");

const form = document.getElementById("confirmForm");
if (!form) {
  console.error("confirmForm not found");
}

const params = new URLSearchParams(window.location.search);

function setVal(id, v) {
  const el = document.getElementById(id);
  if (el) el.value = v || "";
}

setVal("task_id", params.get("task_id"));
setVal("poster_uid", params.get("poster_uid"));
setVal("poster_email", params.get("poster_email"));

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("submit clicked ✅");

  const body = new URLSearchParams({
    task_id: document.getElementById("task_id")?.value || "",
    poster_uid: document.getElementById("poster_uid")?.value || "",
    poster_email: document.getElementById("poster_email")?.value || "",
    worker_name: document.getElementById("worker_name")?.value || "",
    worker_email: document.getElementById("worker_email")?.value || "",
    worker_phone: document.getElementById("worker_phone")?.value || "",
    note: document.getElementById("note")?.value || ""
  });

  try {
   const res = await fetch(
  SCRIPT_URL + "?action=logconfirmation&key=workwith_secret_12345",
  {
    method: "POST",
    body
  }
);


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

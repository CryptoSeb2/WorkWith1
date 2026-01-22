import { auth } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const SCRIPT_URL = "YOUR_SCRIPT_URL_HERE";

const form = document.getElementById("postForm");
const posterUidEl = document.getElementById("poster_uid");
const posterEmailEl = document.getElementById("poster_email");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  if (posterUidEl) posterUidEl.value = user.uid;
  if (posterEmailEl) posterEmailEl.value = user.email || "";
});

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const body = new URLSearchParams();
    fd.forEach((v, k) => body.append(k, v));

    const res = await fetch(SCRIPT_URL + "?action=create", {
      method: "POST",
      body,
    });

    const data = await res.json();

    if (data.ok) {
      alert("Task posted! ✅");
      form.reset();
      window.location.href = "tasks.html";
    } else {
      alert("Something went wrong. Try again.");
      console.log(data);
    }
  });
}

import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";
const p = new URLSearchParams(location.search);

// fill poster fields from URL
document.getElementById("poster_uid").value = p.get("poster_uid") || "";
document.getElementById("poster_email").value = p.get("poster_email") || "";

// require login (we need worker_uid)
onAuthStateChanged(auth, (user) => {
  if (!user) return (location.href = "login.html");
  document.getElementById("worker_uid").value = user.uid;
});

document.getElementById("confirmForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);

  // 1) Google Sheets + Email via Apps Script
  const res = await fetch(SCRIPT_URL + "?action=confirm", {
    method: "POST",
    body: new URLSearchParams(fd),
  });
  const data = await res.json();
  if (!data.ok) return alert(data.error || "Confirm failed.");

  // 2) Website notification in Firestore
  const poster_uid = fd.get("poster_uid");
  const worker_uid = fd.get("worker_uid");

  if (poster_uid && worker_uid) {
    await addDoc(collection(db, "notifications"), {
      poster_uid,
      poster_email: fd.get("poster_email") || "",
      task_id: fd.get("task_id") || "",
      task_title: fd.get("task_title") || "",
      worker_uid,
      worker_name: fd.get("worker_name") || "",
      worker_email: fd.get("worker_email") || "",
      createdAt: serverTimestamp(),
      read: false,
    });
  }

  alert("Confirmed ✅");
  location.href = "tasks.html";
});

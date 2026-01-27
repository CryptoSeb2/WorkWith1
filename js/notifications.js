import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const listEl = document.getElementById("notificationsList");
const emptyEl = document.getElementById("notificationsEmpty");

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[m]));
}

function render(items) {
  if (!items.length) {
    emptyEl.style.display = "block";
    listEl.innerHTML = "";
    return;
  }

  emptyEl.style.display = "none";

  listEl.innerHTML = items.map(n => {
    const createdAt = n.createdAt?.toDate ? n.createdAt.toDate() : null;
    const when = createdAt ? createdAt.toLocaleString() : "";

    const title =
      n.type === "confirm"
        ? `✅ ${esc(n.workerName || "Someone")} confirmed your task`
        : `🔔 ${esc(n.type || "Notification")}`;

    const subtitle = `Task: ${esc(n.taskId || "")}${when ? " • " + esc(when) : ""}`;

    return `
      <div class="card" style="margin-top:12px;">
        <div class="h2" style="font-size:16px;">${title}</div>
        <p class="small">${subtitle}</p>
      </div>
    `;
  }).join("");
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    emptyEl.style.display = "block";
    emptyEl.textContent = "Please log in to see notifications.";
    listEl.innerHTML = "";
    return;
  }

  // IMPORTANT: this must match your Firestore structure
  const itemsRef = collection(db, "notifications", user.uid, "items");
  const q = query(itemsRef, orderBy("createdAt", "desc"), limit(50));

  onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    render(items);
  }, (err) => {
    console.error("Notifications listener error:", err);
    emptyEl.style.display = "block";
    emptyEl.textContent = "Error loading notifications (check Firestore rules).";
  });
});

import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  collection, query, where, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const listEl = document.getElementById("notificationsList");
const emptyEl = document.getElementById("notificationsEmpty");

function render(items) {
  listEl.innerHTML = "";
  if (!items.length) {
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";

  for (const n of items) {
    const div = document.createElement("div");
    div.className = "card";
    div.style.marginTop = "12px";
    div.innerHTML = `
      <div class="small"><b>${n.workerName || "Someone"}</b> confirmed: <b>${n.taskTitle || "a task"}</b></div>
      <div class="small" style="opacity:.8">${new Date(n.createdAt || Date.now()).toLocaleString()}</div>
    `;
    listEl.appendChild(div);
  }
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // not logged in => no notifications to show
    emptyEl.style.display = "block";
    emptyEl.textContent = "Please log in to see notifications.";
    return;
  }

  const q = query(
    collection(db, "notifications"),
    where("toEmail", "==", user.email),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    render(items);
  });
});

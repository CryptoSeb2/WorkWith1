import { db } from "./firebase-init.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const tasksList = document.getElementById("tasksList");

function esc(s) {
  return (s ?? "").toString().replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function taskCard(t) {
  const confirmUrl = `confirm-task.html?task_id=${encodeURIComponent(t.id)}`;
  return `
    <div class="card">
      <div class="pill">${esc(t.category)}</div>
      <div class="h2" style="margin-top:8px;">${esc(t.title)}</div>
      <p class="small">${esc(t.datetime)} • ${esc(t.location)}</p>
      <p class="small"><b>Earn €${esc(t.net_pay)}</b> (net)</p>
      <div class="row" style="margin-top:12px;">
        <a class="btn" href="${confirmUrl}">I can do this</a>
      </div>
    </div>
  `;
}

async function loadTasks() {
  tasksList.innerHTML = "Loading...";

  const q = query(
    collection(db, "tasks"),
    where("status", "==", "approved"),
    orderBy("created_at", "desc")
  );

  const snap = await getDocs(q);
  const items = [];

  snap.forEach(doc => {
    items.push({ id: doc.id, ...doc.data() });
  });

  tasksList.innerHTML = items.length
    ? items.map(taskCard).join("")
    : `<p class="small">No tasks yet.</p>`;
}

loadTasks();


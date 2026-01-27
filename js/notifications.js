import { auth, db } from "./firebase-init.js";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

function el(id) { return document.getElementById(id); }

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // not logged in → send to login
    window.location.href = "login.html";
    return;
  }

  const list = el("notificationsList");
  const empty = el("notificationsEmpty");

  const itemsRef = collection(db, "notifications", user.uid, "items");
  const q = query(itemsRef, orderBy("createdAt", "desc"), limit(50));

  onSnapshot(q, (snap) => {
    list.innerHTML = "";

    if (snap.empty) {
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";

    snap.forEach((doc) => {
      const n = doc.data();
      const div = document.createElement("div");
      div.className = "card";
      div.style.marginTop = "12px";
      div.innerHTML = `
        <div class="h2" style="font-size:16px;">${n.title ?? "Notification"}</div>
        <p class="small" style="margin-top:6px;">${n.message ?? ""}</p>
        <p class="small" style="opacity:.7; margin-top:6px;">
          ${n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : ""}
        </p>
      `;
      list.appendChild(div);
    });
  });
});


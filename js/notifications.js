import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const list = document.getElementById("notifList");

onAuthStateChanged(auth, async (user) => {
  if (!user) return (location.href = "login.html");

  const q = query(
    collection(db, "notifications"),
    where("poster_uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  if (snap.empty) return (list.textContent = "No notifications yet.");

  list.innerHTML = "";
  snap.forEach((d) => {
    const n = d.data();
    const a = document.createElement("a");
    a.href = `view-profile.html?uid=${encodeURIComponent(n.worker_uid)}`;
    a.textContent = `✅ ${n.worker_name || "Someone"} confirmed: ${n.task_title || n.task_id}`;
    a.style.display = "block";
    a.style.marginTop = "8px";
    list.appendChild(a);
  });
});


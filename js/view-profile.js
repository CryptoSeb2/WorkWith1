import { db } from "./firebase-init.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const uid = new URLSearchParams(location.search).get("uid");
const box = document.getElementById("profileBox");

if (!uid) box.textContent = "Missing uid.";
else {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) box.textContent = "Profile not found.";
  else {
    const u = snap.data();
    box.innerHTML = `
      <div><b>Name:</b> ${u.name || ""}</div>
      <div style="margin-top:6px;"><b>Note:</b> ${u.note || ""}</div>
      <div style="margin-top:6px;"><b>Experience:</b> ${u.experience || ""}</div>
      <div style="margin-top:6px;"><b>Degree:</b> ${u.degree || ""}</div>
      <div style="margin-top:6px;"><b>University:</b> ${u.university || ""}</div>
      ${u.photoUrl ? `<img src="${u.photoUrl}" style="margin-top:10px;max-width:180px;border-radius:12px;">` : ""}
    `;
  }
}


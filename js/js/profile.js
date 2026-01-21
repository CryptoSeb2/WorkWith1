// js/profile.js
import { auth, db } from "./firebase-init.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveProfile({ name, note, photo }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: name || "",
    note: note || "",
    photo: photo || "",
    updated_at: new Date().toISOString()
  }, { merge: true });
}

export async function loadProfile() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? snap.data() : null;
}

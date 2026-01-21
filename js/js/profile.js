import { db, auth } from "./firebase-init.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveProfile(data) {
  const user = auth.currentUser;
  if (!user) return;

  await setDoc(doc(db, "users", user.uid), {
    name: data.name,
    note: data.note,
    photo: data.photo || "",
    createdAt: new Date()
  });
}

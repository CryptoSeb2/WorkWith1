import { auth, db, storage } from "./firebase-init.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

const $ = (id) => document.getElementById(id);

const msgEl = $("profileMsg");
const saveBtn = $("saveBtn");
const photoInput = $("photoFile");
const photoPreview = $("photoPreview");

let currentUser = null;
let currentPhotoUrl = "";
let profileExists = false;

function setMsg(text, isError = false) {
  if (!msgEl) return;
  msgEl.textContent = text || "";
  msgEl.style.color = isError ? "tomato" : "";
}

function setBusy(busy) {
  if (!saveBtn) return;
  saveBtn.disabled = !!busy;
  saveBtn.textContent = busy ? "Saving..." : "Save";
}

photoInput?.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (!file) {
    if (photoPreview) photoPreview.style.display = "none";
    return;
  }
  const url = URL.createObjectURL(file);
  photoPreview.src = url;
  photoPreview.style.display = "block";
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  await loadProfile(user.uid);
});

async function loadProfile(uid) {
  setMsg("Loading...");
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      profileExists = true;
      const data = snap.data();
      $("name").value = data.name || "";
      $("university").value = data.university || "";
      $("degree").value = data.degree || "";
      $("experience").value = data.experience || "";
      $("note").value = data.note || "";

      currentPhotoUrl = data.photoUrl || "";
      if (currentPhotoUrl && photoPreview) {
        photoPreview.src = currentPhotoUrl;
        photoPreview.style.display = "block";
      }
    }
    setMsg("");
  } catch (err) {
    console.error(err);
    setMsg(err.message || "Failed to load profile", true);
  }
}

async function uploadPhotoIfNeeded(uid) {
  const file = photoInput?.files?.[0];
  if (!file) return currentPhotoUrl;

  // quick size check (2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Photo too large. Please use an image under 2MB.");
  }

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const photoRef = ref(storage, `profilePhotos/${uid}/${safeName}`);

  await uploadBytes(photoRef, file, { contentType: file.type });
  return await getDownloadURL(photoRef);
}

saveBtn?.addEventListener("click", async () => {
  if (!currentUser) return;

  setBusy(true);
  setMsg("");

  try {
    const uid = currentUser.uid;

    const photoUrl = await uploadPhotoIfNeeded(uid);
    currentPhotoUrl = photoUrl || "";

    const payload = {
      uid,
      email: currentUser.email || "",
      name: $("name").value.trim(),
      university: $("university").value.trim(),
      degree: $("degree").value.trim(),
      experience: $("experience").value.trim(),
      note: $("note").value.trim(),
      photoUrl: currentPhotoUrl,
      updatedAt: serverTimestamp(),
    };

    if (!profileExists) payload.createdAt = serverTimestamp();

    await setDoc(doc(db, "users", uid), payload, { merge: true });

    profileExists = true;
    setMsg("Saved!");
  } catch (err) {
    console.error(err);
    setMsg(err.message || "Save failed", true);
  } finally {
    setBusy(false);
  }
});

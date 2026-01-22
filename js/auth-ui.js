// js/auth.js
import { auth, db } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// ---------- Navbar toggle (runs on every page) ----------
function wireNavbar(user) {
  const navSignup = document.getElementById("navSignup");
  const navLogin = document.getElementById("navLogin");
  const navProfile = document.getElementById("navProfile");
  const navLogout = document.getElementById("navLogout");

  if (!navSignup && !navLogin && !navProfile && !navLogout) return;

  const loggedIn = !!user;

  if (navSignup) navSignup.style.display = loggedIn ? "none" : "";
  if (navLogin) navLogin.style.display = loggedIn ? "none" : "";
  if (navProfile) navProfile.style.display = loggedIn ? "" : "none";
  if (navLogout) navLogout.style.display = loggedIn ? "" : "none";

  if (navLogout) {
    navLogout.onclick = async (e) => {
      e.preventDefault();
      await signOut(auth);
      window.location.href = "index.html";
    };
  }
}

onAuthStateChanged(auth, (user) => {
  wireNavbar(user);
  wireProfilePage(user);
});

// ---------- Signup page ----------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("signupMsg");
    if (msg) msg.textContent = "";

    const email = document.getElementById("su_email")?.value?.trim();
    const password = document.getElementById("su_password")?.value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Create a profile doc in Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        createdAt: serverTimestamp(),
        note: ""
      });

      window.location.href = "profile.html";
    } catch (err) {
      if (msg) msg.textContent = err.message;
      else alert(err.message);
    }
  });
}

// ---------- Login page ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("loginMsg");
    if (msg) msg.textContent = "";

    const email = document.getElementById("li_email")?.value?.trim();
    const password = document.getElementById("li_password")?.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "profile.html";
    } catch (err) {
      if (msg) msg.textContent = err.message;
      else alert(err.message);
    }
  });
}

// ---------- Profile page (basic) ----------
async function wireProfilePage(user) {
  // Only runs if profile page has these elements
  const emailEl = document.getElementById("profileEmail");
  const noteEl = document.getElementById("profileNote");
  const saveBtn = document.getElementById("saveProfile");

  if (!emailEl && !noteEl && !saveBtn) return;

  // If not logged in, send to login
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailEl && (emailEl.textContent = user.email || "");

  // Load existing note
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists() && noteEl) {
    noteEl.value = snap.data().note || "";
  }

  if (saveBtn && noteEl) {
    saveBtn.onclick = async () => {
      await setDoc(
        doc(db, "users", user.uid),
        { note: noteEl.value || "" },
        { merge: true }
      );
      alert("Saved!");
    };
  }
}

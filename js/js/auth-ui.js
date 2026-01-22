import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// SIGNUP
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("su_email").value.trim();
    const password = document.getElementById("su_password").value;

    const msg = document.getElementById("signupMsg");
    msg.textContent = "Creating account...";

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      msg.textContent = "Account created! Redirecting...";
      window.location.href = "profile.html";
    } catch (err) {
      msg.textContent = err.message;
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("li_email").value.trim();
    const password = document.getElementById("li_password").value;

    const msg = document.getElementById("loginMsg");
    msg.textContent = "Logging in...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      msg.textContent = "Logged in! Redirecting...";
      window.location.href = "profile.html";
    } catch (err) {
      msg.textContent = err.message;
    }
  });
}

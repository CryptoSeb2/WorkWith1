import { auth, db } from "./firebase-init.js";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const taskId = params.get("task_id");
document.getElementById("task_id").value = taskId || "";

let currentUser = null;
let taskData = null;

onAuthStateChanged(auth, async (u) => {
  currentUser = u;

  if (!taskId) {
    alert("Missing task_id.");
    return;
  }

  const taskRef = doc(db, "tasks", taskId);
  const taskSnap = await getDoc(taskRef);

  if (!taskSnap.exists()) {
    alert("Task not found.");
    return;
  }

  taskData = { id: taskSnap.id, ...taskSnap.data() };

  // Optional: if not logged in, force login
  if (!currentUser) {
    alert("Please log in to confirm tasks.");
    window.location.href = "login.html";
  }
});

document.getElementById("confirmForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please log in.");
    return;
  }
  if (!taskData) {
    alert("Task not loaded yet.");
    return;
  }

  // TODO: replace these with actual form inputs if you have them
  const worker_name = currentUser.displayName || "Worker";
  const worker_email = currentUser.email || "";

  // 1) Save confirmation
  await addDoc(collection(db, "confirmations"), {
    created_at: serverTimestamp(),
    task_id: taskData.id,
    task_title: taskData.title || "",
    poster_uid: taskData.poster_uid || "",
    poster_email: taskData.poster_email || "",
    worker_uid: currentUser.uid,
    worker_name,
    worker_email,
    status: "new"
  });

  // 2) Create notification for poster
  await addDoc(collection(db, "notifications"), {
    created_at: serverTimestamp(),
    to_uid: taskData.poster_uid || "",
    type: "task_confirmed",
    task_id: taskData.id,
    task_title: taskData.title || "",
    message: `${worker_name} confirmed your task: ${taskData.title}`,
    read: false
  });

  alert("Confirmed! The poster has been notified.");
  window.location.href = "tasks.html";
});


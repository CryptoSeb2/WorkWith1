import { db } from "./firebase-init.js";
import {
  addDoc, collection
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Helper: read query params from confirm link
const params = new URLSearchParams(window.location.search);

// You MUST have poster_email in the confirm link query params.
// Example: confirm-task.html?task_id=...&title=...&poster_email=someone@gmail.com
const posterEmail = params.get("poster_email");
const taskTitle = params.get("title");
const taskId = params.get("task_id");

// call this after your confirm POST succeeds
export async function createNotification({ workerName }) {
  if (!posterEmail) {
    console.warn("No poster_email in URL, can't create notification.");
    return;
  }

  await addDoc(collection(db, "notifications"), {
    toEmail: posterEmail,
    taskId: taskId || "",
    taskTitle: taskTitle || "",
    workerName: workerName || "",
    createdAt: Date.now(),
    read: false
  });
}

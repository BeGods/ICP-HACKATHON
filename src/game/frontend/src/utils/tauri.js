import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

async function checkPermission() {
  if (!(await isPermissionGranted())) {
    return (await requestPermission()) === "granted";
  }
  return true;
}

export async function enqueueNotification() {
  try {
    if (!(await checkPermission())) {
      console.log("Notification permission denied.");
      return;
    }

    sendNotification({ title: "Tauri", body: "Tauri is awesome!" });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

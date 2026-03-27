import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async (accountUuid: string) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey: "BA_zHu7baSzDV9UxVczEhaRtviXyZOix7v5oavcTl3lI_iGajf9DRz9iZjxhSn-1LrA3m-iWnpxD5fEtuUnkZfs",
    });

    await fetch("http://localhost:3001/api/notifications/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountUuid, fcmToken: token }),
    });

    console.log("FCM Token:", token);
    return token;

  } catch (error) {
    console.error("Notification permission error:", error);
    return null;
  }
};

export const sendSpendNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icon.png",
    });
  }
};
import { registerForPush, listenForForegroundMessages } from '../firebase/messaging.js'

export async function initPushNotifications(uid, onForegroundMessage) {
  await registerForPush(uid)
  await listenForForegroundMessages(onForegroundMessage)
}

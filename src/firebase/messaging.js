import { getToken, onMessage } from 'firebase/messaging'
import { getMessagingIfSupported } from './config.js'
import { updateUserProfile } from './firestore.js'

export async function registerForPush(uid) {
  const messaging = await getMessagingIfSupported()
  if (!messaging) return null
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return null

  const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY })
  if (token && uid) await updateUserProfile(uid, { fcmToken: token })
  return token
}

export async function listenForForegroundMessages(handler) {
  const messaging = await getMessagingIfSupported()
  if (!messaging) return
  onMessage(messaging, handler)
}

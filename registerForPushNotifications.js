import {Notifications} from 'expo'
import * as Permissions from 'expo-permissions'

export default async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  let finalStatus = existingStatus

  // if permission is not granted try once to get permission
  if (existingStatus !== 'granted') {
    const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = permission.status
  }

  if (finalStatus !== 'granted') return

  const token = await Notifications.getExpoPushTokenAsync()

  if (Platform.OS === 'android') {
    await Notifications.createChannelAndroidAsync('general-notifications', {
      name: 'General Notifications',
      sound: true,
    })
  }

  return token
}

import {AsyncStorage} from 'react-native'
import moment from 'moment-timezone'

export const notificationLastViewed = async id => {
  const lastViewed = await AsyncStorage.getItem(id)
  if (!lastViewed) return null
  return moment(lastViewed)
}

export const notificationIsViewable = async (id, notification = { expires: 'daily' }) => {
  const lastViewed = await notificationLastViewed(id)
  switch (notification.expires) {
    case 'daily':
      return lastViewed === null || lastViewed.isBefore(moment(), 'day')
    case 'never':
      return lastViewed === null
    default:
      return false
  }
}

export const setNotificationViewed = async id => {
  await AsyncStorage.setItem(id, moment().format('YYYY-MM-DD'))
}

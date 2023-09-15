import {AsyncStorage} from 'react-native'
import * as Localization from 'expo-localization'
import {logOut as authLogOut} from '../auth'
import {recoveryPlan, recoveryPlanId as getRecoveryPlanId, userOrganizationRole} from '../redux/getters/user'

export const logIn = async (props) => {
  // Updating/Loading
  if (
    props.userUpdating
    || props.userLoading
    || props.recoveryPlanLoading
  ) {
    if (props.userUpdating) console.log('props.userUpdating')
    if (props.userLoading) console.log('props.userLoading')
    if (props.recoveryPlanLoading) console.log('props.recoveryPlanLoading')
    return
  }

  // Errors
  if (props.userUpdateError) {
    console.log('[User Update Error]:', props.userUpdateError.message)
    props.navigation.navigate('LogIn', { error: props.userUpdateError.message, message: null })
    return
  }
  if (props.userError) {
    console.log('[User Load Error]:', props.userError.message)
    props.navigation.navigate('LogIn', { error: props.userError.message, message: null })
    return
  }

  // 1. Check for auth'd user token
  const userToken = await AsyncStorage.getItem('userToken')
  if (!userToken) {
    await logOut(props, { navigate: false })
    props.navigation.navigate('Welcome')
    return
  }


  // 2 Get auth'd user from API
  if (!props.userLoading && !props.user) {
    props.fetchAuthUser()
    return
  }

  // 3.a Must have user to proceed
  if (!props.user) {
    return
  }

  // 3.b STOPGAP -> ensure user has timezone
  if (!props.user.timeZone) {
    console.log('User has no time zone. Updating now...', Localization.timezone)
    props.updateUser({
      id: props.user.id,
      timeZone: Localization.timezone,
    })
    return
  }

  // 3.c Ensure user has user org role
  // console.log(props.user)
  const patientRole = userOrganizationRole(props.user)
  if (!patientRole) {
    props.navigation.navigate('LogIn', {
      error: 'User has not been on-boarded as a patient',
    })
    return
  }

  // 4. Fetch unread messages
  // if (!props.unreadMessagesLoading && !props.unreadMessages.length && !props.unreadMessagesError) {
  //   props.fetchUnreadMessages(userOrganizationRole(props.user).id)
  //   return
  // }

  if (!recoveryPlan(props.user)) {
    console.error('no recovery plan')
    props.navigation.navigate('LogIn', {
      error: 'Patient does not have a recovery plan',
    })
    return
  }

  // 5. Error handling. Send back to log in
  if (props.recoveryPlanError !== null) {
    await logOut(props, { error: props.recoveryPlanError.message })
    return
  }

  // 6. Onboarding (only check every so often)
  if (patientRole.healthConditions === null) {
    props.navigation.navigate('Onboard')
    return
  }

  // 7. Navigate to app
  props.navigation.navigate('App')
}

export const logOut = async (
  props,
  {
    navigate = true,
    message = 'You have been successfully logged out.',
    error,
    params = {},
  } = {},
) => {
  await authLogOut()
  if (error) console.log('[User Logout Error]:', error)
  if (navigate) props.navigation.navigate('LogIn', { message: error ? undefined : message, error, ...params })
  props.userLogOut()
}

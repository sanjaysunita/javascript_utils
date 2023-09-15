import moment from 'moment-timezone'
import config from '../config'

export const getMissedAssignments = (assignments, date) => assignments.reduce((found, assignment) => {
  const matched = moment(assignment.date).isBefore(date, 'day')
  if (matched) return found.concat(assignment.items)
  return []
}, [])

export const getDayAssignments = (assignments, date) => assignments.reduce((found, assignment) => {
  if (found.length > 0) return found
  const matched = moment(assignment.date).isSame(date, 'day')
  if (matched) return assignment.items
  return []
}, [])

export const activityAssignmentsComplete = activityAssignments => Object.keys(activityAssignments).reduce(
  (allComplete, timeOfDay) => {
    if (timeOfDay === 'missed') return allComplete
    if (allComplete === false) return false
    if (activityAssignments[timeOfDay].assignments.length === 0) return allComplete
    return activityAssignments[timeOfDay].complete === activityAssignments[timeOfDay].assignments.length
  },
  null,
)

export const getActivityTypeLabel = type => ({
  EXERCISE: 'Exercise',
  WALKING: 'Exercise',
  STRETCH: 'Stretching',
  RELAXATION: 'Wellness',
  ARTICLE: 'Article',
  SURVEY: 'Survey',
}[type])

export const getActivityAsset = (activity, type = 'IMAGE', primary) => (
  activity.Assets.find((resource) => (
    resource.type === type
    && (!primary || resource.isPrimary === primary)
  ))
)

export const getActivityIconProps = (type) => {
  switch (type) {
    case 'RELAXATION':
      return {
        name: 'wellness',
        color: '#8AA4FF',
        background: '#DCE2F6',
        square: true,
      }
    case 'ARTICLE':
      return {
        name: 'info',
        color: '#5CB9C5',
        background: '#bfe8f0',
        square: true,
      }
    case 'SURVEY':
      return {
        name: 'survey',
        color: '#e4c071',
        background: '#ffefcc',
        square: true,
      }
    case 'WALKING':
      return {
        name: 'walking',
        color: '#FF948A',
        background: '#FFF4F3',
        square: true,
      }
    case 'EXERCISE':
    case 'STRETCH':
      return {
        name: 'activity',
        color: '#FF948A',
        background: '#FFF4F3',
        square: true,
      }
    default:
      throw new Error(`Unknown activity type: ${type}`)
  }
}

export const getTimeOfDayActivityAssignments = (
  activityAssignments,
  time,
) => {
  if (!activityAssignments) return { completed: [], isComplete: false, assignments: [] }
  const matchedActivities = []
  let complete = 0
  activityAssignments.forEach((activityAssignment) => {
    if (activityAssignment.time === time) {
      matchedActivities.push(activityAssignment)
      if (activityAssignment.completed) complete += 1
    }
  })

  return {
    complete,
    assignments: matchedActivities,
  }
}

export const getActivityAssignmentsPlanDateRange = activityAssignments => activityAssignments.reduce(
  (dateRange, assignment) => {
    const date = moment(assignment.date)
    return [
      !dateRange[0] || date.isBefore(dateRange[0], 'day') ? date : dateRange[0],
      !dateRange[1] || date.isAfter(dateRange[1], 'day') ? date : dateRange[1],
    ]
  },
  [null, null],
)

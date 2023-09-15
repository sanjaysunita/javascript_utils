import moment from 'moment-timezone'

export const getRecoveryPlanDateRange = recoveryPlan => recoveryPlan.Routines.reduce(
  (dateRange, routine) => {
    const startDate = moment(routine.startDate)
    const stopDate = moment(routine.stopDate)
    return [
      !dateRange[0] || startDate.isBefore(dateRange[0], 'day') ? startDate : dateRange[0],
      !dateRange[1] || stopDate.isAfter(dateRange[1], 'day') ? stopDate : dateRange[1],
    ]
  },
  [null, null]
)

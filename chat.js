export const getChannelAssignmentName = (assignment) => (
  assignment.parent.name || `${assignment.parent.user.first_name} ${assignment.parent.user.last_name}`
)

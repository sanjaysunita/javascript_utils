import config from '../config'

/**
 * Gets an array of date objects between two dates, based on an interval.
 *
 * @author Adrian Moisa
 * @see https://stackoverflow.com/a/32374035/2292329
 *
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @param {String} interval
 * @param {Number} total
 * @returns {[]}
 */
export const getDatesRangeArray = ({startDate, endDate, interval = 'days', total = 1}) => {
  const dateArray = []
  let currentDate = startDate.clone()

  while (currentDate < endDate) {
    dateArray.push(currentDate)
    currentDate = currentDate.clone().add(total, interval)
  }

  return dateArray
}

/**
 * Gets the embed version from a youtube link.
 *
 * e.g. https://www.youtube.com/watch?v=vek5po7xuy4 -> https://www.youtube.com/embed/vek5po7xuy4
 *
 * @param {String} link Original youtube link.
 * @returns {String|Boolean} False on error.
 */
export const getYoutubeEmbedLink = (link) => {
  const videoMatch = link.trim().match(/(v=|embed\/)(.*?)(&|$|\s)/)
  if (!videoMatch || !videoMatch[2]) {
    return false
  } else {
    const videoId   = videoMatch[2]
    const urlParams = new URLSearchParams({
      autoplay: 'false',
      controls: '1',
      enablejsapi: '0',
      fs: '1',
    }).toString()

    return `https://youtube.com/embed/${videoId}?${urlParams}`
  }
}

export const getFile = id => `${config.API_URL}/files/${id}?view=true`

export const getGreetingTime = (moment) => {
  let g = null

  if (!moment || !moment.isValid()) {
    return
  }

  const split_afternoon = 12
  const split_evening   = 18
  const currentHour     = parseFloat(moment.format('HH'))

  if (currentHour >= split_afternoon && currentHour <= split_evening) {
    g = 'afternoon'
  } else if (currentHour >= split_evening) {
    g = 'evening'
  } else {
    g = 'morning'
  }

  return g
}

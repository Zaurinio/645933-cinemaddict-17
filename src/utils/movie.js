import dayjs from 'dayjs';

const sortFilmsByRating = (filmA, filmB) => (filmB.totalRating - filmA.totalRating);
const sortFilmsByDate = (filmA, filmB) => (dayjs(filmB.date).diff(dayjs(filmA.date)));

const MAX_DESCRIPTION_LENGTH = 140;
const MINUTES_IN_HOUR = 60;

const getStandardDescription = (description) => description.length > MAX_DESCRIPTION_LENGTH ? `${description.substring(0, MAX_DESCRIPTION_LENGTH - 1)}...` : description;

const getFormattedMovieDuration = (duration) => {
  const hours = Math.floor(duration / MINUTES_IN_HOUR);
  const minutes = duration % MINUTES_IN_HOUR;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export { sortFilmsByDate, sortFilmsByRating, getStandardDescription, getFormattedMovieDuration };

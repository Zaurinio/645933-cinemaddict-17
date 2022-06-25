import dayjs from 'dayjs';

const sortFilmsByRating = (filmA, filmB) => (filmB.totalRating - filmA.totalRating);
const sortFilmsByDate = (filmA, filmB) => (dayjs(filmB.date).diff(dayjs(filmA.date)));

const MAX_DESCRIPTION_LENGTH = 140;

const getStandardDescription = (description) => description.length > MAX_DESCRIPTION_LENGTH ? `${description.substring(0, MAX_DESCRIPTION_LENGTH - 1)}...` : description;

export { sortFilmsByDate, sortFilmsByRating, getStandardDescription };

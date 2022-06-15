import dayjs from 'dayjs';

const sortFilmsByRating = (filmA, filmB) => (filmB.totalRating - filmA.totalRating);
const sortFilmsByDate = (filmA, filmB) => (dayjs(filmB.date).diff(dayjs(filmA.date)));

export { sortFilmsByDate, sortFilmsByRating };

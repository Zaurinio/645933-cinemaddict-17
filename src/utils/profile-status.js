const ProfileRating = {
  NOVICE: {
    name: 'Novice',
    minMoviesAmount: 1,
  },
  FAN: {
    name: 'Fan',
    minMoviesAmount: 11,
  },
  MOVIE_BUFF: {
    name: 'Movie Buff',
    minMoviesAmount: 21,
  }
};

const getWatchedMoviesQty = (movies) => movies.filter((movie) => movie.alreadyWatched).length;

const checkProfileRating = (movies) => {
  const watchedMoviesQty = getWatchedMoviesQty(movies);

  switch (true) {
    case (watchedMoviesQty >= ProfileRating.MOVIE_BUFF.minMoviesAmount):
      return ProfileRating.MOVIE_BUFF.name;
    case watchedMoviesQty >= ProfileRating.FAN.minMoviesAmount:
      return ProfileRating.FAN.name;
    case watchedMoviesQty >= ProfileRating.NOVICE.minMoviesAmount:
      return ProfileRating.NOVICE.name;
  }
};

export { checkProfileRating };

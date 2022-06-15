import { FilterType } from '../const.js';

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.favorite),
};

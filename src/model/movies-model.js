import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class MoviesModel extends Observable {
  #moviesApiService = null;
  #movies = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies() {
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch (err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateFilm(update);
      const updatedMovie = this.#adaptToClient(response);

      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (movie) => ({
    id: movie['id'],
    comments: movie['comments'],
    title: movie['film_info']['title'],
    alternativeTitle: movie['film_info']['alternative_title'],
    totalRating: movie['film_info']['total_rating'],
    poster: movie['film_info']['poster'],
    ageRating: movie['film_info']['age_rating'],
    director: movie['film_info']['director'],
    writers: movie['film_info']['writers'],
    actors: movie['film_info']['actors'],
    date: movie['film_info']['release']['date'],
    releaseCountry: movie['film_info']['release']['release_country'],
    runtime: movie['film_info']['runtime'],
    genres: movie['film_info']['genre'],
    description: movie['film_info']['description'],
    watchlist: movie['user_details']['watchlist'],
    alreadyWatched: movie['user_details']['already_watched'],
    favorite: movie['user_details']['favorite'],
    watchingDate: movie['user_details']['watching_date'] !== null ? new Date(movie['user_details']['watching_date']) : movie['user_details']['watching_date'],
  });
}


import { generateMovie } from '../mock/movies.js';

export default class MoviesModel {
  #movies = Array.from({ length: 5 }, generateMovie);

  get movies() {
    return this.#movies;
  }
}

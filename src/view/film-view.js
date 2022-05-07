import { createElement } from '../render.js';
import { humanizeMovieReleaseDate } from '../utils.js';

const createFilmTemplate = (movie) => {
  const { filmCommentsId, id } = movie;
  const { title, totalRating, runtime, genre, description } = movie.filmInfo;
  const { date } = movie.filmInfo.release;
  const releaseDate = humanizeMovieReleaseDate(date);
  const commentsQty = filmCommentsId.length;

  return (
    `<article class="film-card">
  <a class="film-card__link" data-id=${id}>
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseDate}</span>
      <span class="film-card__duration">${runtime}m</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="./images/posters/the-dance-of-life.jpg" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${commentsQty} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`
  );
};

export default class FilmView {
  #element = null;
  #movie = null;

  constructor(movie) {
    this.#movie = movie;
  }


  get template() {
    return createFilmTemplate(this.#movie);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  deleteElement() {
    this.#element = null;
  }
}

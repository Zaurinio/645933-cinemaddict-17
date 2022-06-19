import { render, remove, replace } from '../framework/render.js';
import FilmView from '../view/film-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class MoviePresenter {
  #movieComponent = null;
  #filmsListContainer = null;
  #changeData = null;
  #popupCallback = null;


  constructor(filmsListContainer, changeData, popupCallback) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#popupCallback = popupCallback;

  }

  init = (movie) => {
    this.movie = movie;

    const prevMovieComponent = this.#movieComponent;

    this.#movieComponent = new FilmView(movie);

    this.#movieComponent.setCardClickHandler(this.#popupCallback);
    this.#movieComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#movieComponent.setWatchedlistClickHandler(this.#handleWatchedClick);
    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevMovieComponent === null) {
      render(this.#movieComponent, this.#filmsListContainer);
      return;
    }

    if (prevMovieComponent) {
      replace(this.#movieComponent, prevMovieComponent);
    }
  };

  destroy = () => {
    remove(this.#movieComponent);
  };


  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.movie, watchlist: !this.movie.watchlist },
    );

  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.movie, alreadyWatched: !this.movie.alreadyWatched },
    );
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.movie, favorite: !this.movie.favorite },
    );
  };
}

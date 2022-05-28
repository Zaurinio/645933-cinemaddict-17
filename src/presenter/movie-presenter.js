import { render, remove, replace } from '../framework/render.js';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popup-view';

const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

export default class MoviePresenter {
  #movieComponent = null;
  #filmsListContainer = null;
  #popupComponent = null;
  #changeData = null;
  #changeMode = null;
  #movie = null;
  #mode = Mode.CLOSED;


  constructor(filmsListContainer, changeData, changeMode) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (movie) => {
    this.movie = movie;

    const prevMovieComponent = this.#movieComponent;
    // const prevPopupComponent = this.#popupComponent;

    this.#movieComponent = new FilmView(movie);

    this.#movieComponent.setCardClickHandler(this.#showPopup);
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

    // if (this.#mode === Mode.OPENED && prevMovieComponent) {
    //   this.createPopup();
    //   replace(this.#popupComponent, prevPopupComponent);

    // }
  };

  createPopup = () => {
    this.#popupComponent = new PopupView(this.movie);

    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setWatchedlistClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#popupComponent.setCloseButtonClickHandler(this.#hidePopup);
  };

  resetView = () => {
    if (this.#mode !== Mode.CLOSED) {
      this.#hidePopup();
      this.#mode = Mode.CLOSED;
    }
  };

  destroy = () => {
    remove(this.#movieComponent);
  };

  #showPopup = () => {

    this.createPopup();
    this.#changeMode();
    document.body.appendChild(this.#popupComponent.element);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.OPENED;
  };

  #hidePopup = () => {
    document.body.querySelector('.film-details').remove();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.CLOSED;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
    }
  };

  #handleWatchlistClick = () => {
    this.#changeData({ ...this.movie, userDetails: { ...this.movie.userDetails, watchlist: !this.movie.userDetails.watchlist } });
  };

  #handleWatchedClick = () => {
    this.#changeData({ ...this.movie, userDetails: { ...this.movie.userDetails, alreadyWatched: !this.movie.userDetails.alreadyWatched } });
  };

  #handleFavoriteClick = () => {
    this.#changeData({ ...this.movie, userDetails: { ...this.movie.userDetails, favorite: !this.movie.userDetails.favorite } });
  };
}

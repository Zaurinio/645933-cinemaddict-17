import FilmsView from '../view/films-view.js';
import FilmView from '../view/film-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PopupView from '../view/popup-view';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyPageView from '../view/empty-page-view.js';
import { render, remove } from '../framework/render.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class PagePresenter {
  #filmsComponent = new FilmsView();
  #pageContainer = null;
  #moviesModel = null;
  #pageMovies = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #showMoreButtonComponent = new ShowMoreButtonView();
  #emptyPageComponent = new EmptyPageView();

  #popupComponent = (movie) => new PopupView(movie);

  init = (pageContainer, moviesModel) => {
    this.#pageContainer = pageContainer;
    this.#moviesModel = moviesModel;
    this.#pageMovies = [...this.#moviesModel.movies];

    render(new FilterView(), this.#pageContainer);
    render(new SortView(), this.#pageContainer);
    render(this.#filmsComponent, this.#pageContainer);

    if (this.#pageMovies.length > 0) {
      for (let i = 0; i < Math.min(this.#pageMovies.length, MOVIE_COUNT_PER_STEP); i++) {
        this.#renderMovie(this.#pageMovies[i]);
      }
    } else {
      render(this.#emptyPageComponent, this.#filmsComponent.element);
    }

    if (this.#pageMovies.length > MOVIE_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsComponent.filmsList);
      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        hidePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const showPopup = (evt) => {
      const filmCard = evt.target.closest('.film-card__link');
      if (filmCard) {
        const movieId = filmCard.dataset.id;
        document.body.appendChild(this.#popupComponent(this.#pageMovies[movieId]).element);
        document.body.classList.add('hide-overflow');
        document.addEventListener('keydown', onEscKeyDown);
      }
    };

    function hidePopup() {
      document.body.querySelector('.film-details').remove();
      document.body.classList.remove('hide-overflow');
    }

    this.#filmsComponent.setClickHandler((evt) => {
      showPopup(evt);
      document.body.querySelector('.film-details__close-btn').addEventListener('click', hidePopup);
    });

  };

  #renderMovie = (movie) => {
    const movieComponent = new FilmView(movie);
    render(movieComponent, this.#filmsComponent.filmsListContainer);
  };

  #handleShowMoreButtonClick = () => {
    this.#pageMovies
      .slice(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#pageMovies.length) {
      remove(this.#showMoreButtonComponent);
    }
  };
}

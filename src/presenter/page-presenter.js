import FilmsView from '../view/films-view.js';
// import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyPageView from '../view/empty-page-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import MoviePresenter from './movie-presenter';
import PopupPresenter from './popup-presenter';
import { UserAction, UpdateType } from '../const.js';
import { filter } from '../utils/filter.js';
import { sortFilmsByRating, sortFilmsByDate } from '../utils/movie.js';
import { SortType } from '../const.js';
import LoadingView from '../view/loading-view.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class PagePresenter {
  #filmsComponent = new FilmsView();
  #pageContainer = null;
  #moviesModel = null;
  #filterModel = null;
  #commentsModel = null;
  #popupPresenter = null;
  #loadingComponent = new LoadingView();

  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #showMoreButtonComponent = null;
  #emptyPageComponent = new EmptyPageView();
  #sortComponent = new SortView();
  #moviePresenter = new Map();
  #popupMovie = null;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  #renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  constructor(pageContainer, moviesModel, filterModel, commentsModel) {
    this.#pageContainer = pageContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#popupPresenter = new PopupPresenter(
      this.#handleViewAction,
      this.#commentsModel
    );
  }


  get movies() {
    const filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[filterType](movies);

    switch (this.#currentSortType) {
      case SortType.BY_RATING:
        return filteredMovies.sort(sortFilmsByRating);
      case SortType.BY_DATE:
        return filteredMovies.sort(sortFilmsByDate);
    }

    return filteredMovies;
  }

  init = () => {
    this.#renderPage();
  };

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#moviesModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenter.get(data.id).init(data);
        this.#updateOpenedPopup();
        break;
      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderPage();
        this.#updateOpenedPopup();
        break;
      case UpdateType.MAJOR:
        this.#clearPage({ resetRenderedMoviesCount: true });
        this.#renderPage();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPage();
        break;
    }
  };


  #renderSort = () => {
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#pageContainer);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPage({ resetRenderedMoviesCount: true });
    this.#renderPage();
  };

  #renderPopup = (movie) => {
    this.#popupPresenter.showPopup(movie);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#filmsComponent.filmsListContainer, this.#handleViewAction, () => this.#renderPopup(movie));
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  };

  #renderNoMovies = () => {
    render(this.#emptyPageComponent, this.#filmsComponent.element);
  };

  #renderMoviesList = () => {
    const moviesCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesCount, MOVIE_COUNT_PER_STEP));

    if (moviesCount > 0) {
      this.#renderMovies(movies);
    } else {
      render(this.#emptyPageComponent, this.#filmsComponent.element);
    }

    if (moviesCount > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#showMoreButtonComponent, this.#filmsComponent.filmsList);
  };

  #clearPage = ({ resetRenderedMoviesCount = false } = {}) => {
    const moviesCount = this.movies.length;

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();

    remove(this.#sortComponent);
    remove(this.#emptyPageComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#loadingComponent);

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    } else {
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }
  };

  #updateOpenedPopup = () => {
    if (this.#popupPresenter.mode === 'OPENED') {
      this.#popupMovie = this.#popupPresenter.movie;
      const currentMovie = this.movies.find((movie) => movie.id === this.#popupMovie.id);
      const prevElement = this.#popupPresenter.popupComponent.element;
      const scrollPosition = prevElement.scrollTop;
      remove(this.#popupPresenter.popupComponent);
      this.#renderPopup(currentMovie);
      const newElement = this.#popupPresenter.popupComponent.element;
      newElement.scrollTop = scrollPosition;
    }
  };

  #renderPage = () => {

    this.#renderSort();
    render(this.#filmsComponent, this.#pageContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const movies = this.movies;

    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this.#renderNoMovies();
      return;
    }

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  };

  #handleShowMoreButtonClick = () => {
    const movieCount = this.movies.length;

    const newRenderedMovieCount = Math.min(movieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCount, newRenderedMovieCount);

    this.#renderMovies(movies);

    if (this.#renderedMovieCount >= movieCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}

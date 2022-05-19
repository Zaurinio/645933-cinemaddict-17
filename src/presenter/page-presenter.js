import FilmsView from '../view/films-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyPageView from '../view/empty-page-view.js';
import { render, remove } from '../framework/render.js';
import MoviePresenter from './movie-presenter';
import { updateItem } from '../utils/common.js';

const MOVIE_COUNT_PER_STEP = 5;


export default class PagePresenter {
  #filmsComponent = new FilmsView();
  #pageContainer = null;
  #moviesModel = null;
  #pageMovies = [];
  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #showMoreButtonComponent = new ShowMoreButtonView();
  #emptyPageComponent = new EmptyPageView();
  #sortComponent = new SortView();
  #filterComponent = new FilterView();
  #moviePresenter = new Map();

  constructor(pageContainer, moviesModel) {
    this.#pageContainer = pageContainer;
    this.#moviesModel = moviesModel;
  }

  init = () => {
    this.#pageMovies = [...this.#moviesModel.movies];

    this.#renderPage();
  };

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  };

  #handleMovieChange = (updatedMovie) => {
    this.#pageMovies = updateItem(this.#pageMovies, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  };

  #renderFilter = () => {
    render(this.#filterComponent, this.#pageContainer);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#pageContainer);
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#filmsComponent.filmsListContainer, this.#handleMovieChange, this.#handleModeChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #renderMovies = (from, to) => {
    this.#pageMovies
      .slice(from, to)
      .forEach((movie) => this.#renderMovie(movie));
  };

  #clearMovieList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };


  #renderMoviesList = () => {
    if (this.#pageMovies.length > 0) {
      for (let i = 0; i < Math.min(this.#pageMovies.length, MOVIE_COUNT_PER_STEP); i++) {
        this.#renderMovie(this.#pageMovies[i]);
      }
    } else {
      render(this.#emptyPageComponent, this.#filmsComponent.element);
    }

    if (this.#pageMovies.length > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsComponent.filmsList);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderPage = () => {
    this.#renderMoviesList();
    this.#renderFilter();
    this.#renderSort();
    render(this.#filmsComponent, this.#pageContainer);
  };

  #handleShowMoreButtonClick = () => {
    this.#renderMovies(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);

    this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (this.#renderedMovieCount >= this.#pageMovies.length) {
      remove(this.#showMoreButtonComponent);
    }
  };
}


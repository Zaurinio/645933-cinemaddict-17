import FilmsView from '../view/films-view.js';
// import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyPageView from '../view/empty-page-view.js';
import { render, remove } from '../framework/render.js';
import MoviePresenter from './movie-presenter';
import PopupPresenter from './popup-presenter';
import { UserAction, UpdateType } from '../const.js';
import { filter } from '../utils/filter.js';
import { sortFilmsByRating, sortFilmsByDate } from '../utils/movie.js';
import { SortType } from '../const.js';
// import commentsModel from '../model/comments-model.js';

const MOVIE_COUNT_PER_STEP = 5;

export default class PagePresenter {
  #filmsComponent = new FilmsView();
  #pageContainer = null;
  #moviesModel = null;
  #filterModel = null;
  #commentsModel = null;
  #popupPresenter = null;

  #renderedMovieCount = MOVIE_COUNT_PER_STEP;
  #showMoreButtonComponent = null;
  #emptyPageComponent = new EmptyPageView();
  #sortComponent = new SortView();
  // #filterComponent = new FilterView();
  #moviePresenter = new Map();
  #popupMovie = null;
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardTasks = [];

  #renderedMoviesCount = MOVIE_COUNT_PER_STEP;

  constructor(pageContainer, moviesModel, filterModel, commentsModel) {
    this.#pageContainer = pageContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

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
    // this.#pageMovies = [...this.#moviesModel.movies];

    this.#renderPage();
  };

  #handleModeChange = () => {
    this.#moviePresenter.forEach((presenter) => presenter.resetView());
  };

  // #handleMovieChange = (updatedMovie) => {
  //   this.#pageMovies = updateItem(this.#pageMovies, updatedMovie);
  //   this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  // };

  #handleViewAction = (actionType, updateType, update) => {
    // console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные

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
    // console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#moviePresenter.get(data.id).init(data);
        this.#updateOpenedPopup();
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearPage();
        this.#renderPage();
        this.#updateOpenedPopup();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearPage({ resetRenderedMoviesCount: true });
        this.#renderPage();
        break;
    }
  };

  // #renderFilter = () => {
  //   render(this.#filterComponent, this.#pageContainer);
  // };

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

  // #renderSort = () => {
  //   this.#sortComponent = new SortView(this.#currentSortType);
  //   this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  //   render(this.#sortComponent, this.#boardContainer);
  // };

  #renderPopup = (movie) => {
    this.#popupPresenter.showPopup(movie);
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

  // #clearMovieList = () => {
  //   this.#moviePresenter.forEach((presenter) => presenter.destroy());
  //   this.#moviePresenter.clear();
  //   this.#renderedMovieCount = MOVIE_COUNT_PER_STEP;
  //   remove(this.#showMoreButtonComponent);
  // };


  #renderMoviesList = () => {
    const moviesCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesCount, MOVIE_COUNT_PER_STEP));

    if (moviesCount > 0) {
      // for (let i = 0; i < Math.min(this.#pageMovies.length, MOVIE_COUNT_PER_STEP); i++) {
      //   this.#renderMovie(this.#pageMovies[i]);
      // }
      this.#renderMovies(movies);
    } else {
      render(this.#emptyPageComponent, this.#filmsComponent.element);
    }

    if (moviesCount > MOVIE_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderShowMoreButton = () => {
    // render(this.#showMoreButtonComponent, this.#filmsComponent.filmsList);
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

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }

    // if (resetSortType) {
    //   this.#currentSortType = SortType.DEFAULT;
    // }
  };

  #updateOpenedPopup = () => {
    this.#popupMovie = this.#popupPresenter.movie;
    const currentMovie = this.movies.find((movie) => movie.id === this.#popupMovie.id);
    const prevElement = this.#popupPresenter.popupComponent.element;
    const scrollPosition = prevElement.scrollTop;
    if (this.#popupPresenter.mode === 'OPENED') {
      remove(this.#popupPresenter.popupComponent);
      this.#renderPopup(currentMovie);
      const newElement = this.#popupPresenter.popupComponent.element;
      newElement.scrollTop = scrollPosition;
    }
  };

  #renderPage = () => {
    const movies = this.movies;

    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this.#renderNoMovies();
      return;
    }

    // this.#renderMoviesList();
    // this.#renderFilter();
    this.#renderSort();
    render(this.#filmsComponent, this.#pageContainer);


    // Теперь, когда #renderBoard рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу TASK_COUNT_PER_STEP на свойство #renderedTaskCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)));

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }
  };

  #handleShowMoreButtonClick = () => {
    // this.#renderMovies(this.#renderedMovieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    // this.#renderedMovieCount += MOVIE_COUNT_PER_STEP;

    const movieCount = this.movies.length;

    const newRenderedMovieCount = Math.min(movieCount, this.#renderedMovieCount + MOVIE_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMovieCount, newRenderedMovieCount);

    this.#renderMovies(movies);

    if (this.#renderedMovieCount >= movieCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}


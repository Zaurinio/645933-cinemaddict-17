import { replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import PopupView from '../view/popup-view.js';
import LoadingView from '../view/loading-view.js';
import { remove } from '../framework/render.js';

const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};


export default class PopupPresenter {
  popupComponent = null;
  mode = Mode.CLOSED;
  #changeData = null;
  #commentsModel = null;
  movie = null;
  comments = [];
  #isLoading = true;
  #loadingComponent = new LoadingView();


  constructor(changeData, commentsModel) {
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#handlePresenterEvent);
  }

  #handlePresenterEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.renderPopup();
        break;
    }
  };

  #createPopup = () => {

    // if (this.#isLoading) {
    //   this.#renderLoading();
    //   return;
    // }

    this.comments = this.#commentsModel.commentsList;


    this.popupComponent = new PopupView(this.movie, this.comments);

    const prevPopupComponent = this.popupComponent;

    this.popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.popupComponent.setWatchedlistClickHandler(this.#handleWatchedClick);
    this.popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.popupComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    this.popupComponent.setCommentDeleteHandler(this.#handleDeleteButtonClick);

    this.popupComponent.setCloseButtonClickHandler(this.#hidePopup);

    if (this.mode === Mode.OPENED) {
      replace(this.popupComponent, prevPopupComponent);
    }
  };

  // #renderLoading = () => {
  //   render(this.#loadingComponent, this.popupComponent.element, RenderPosition.AFTERBEGIN);
  //   console.log('loading');
  // };

  showPopup = (movie) => {
    this.movie = movie;

    this.#commentsModel.init(this.movie);

  };

  renderPopup = () => {
    this.#createPopup();

    document.body.appendChild(this.popupComponent.element);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.mode = Mode.OPENED;
  };

  #hidePopup = () => {
    document.body.querySelector('.film-details').remove();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.mode = Mode.CLOSED;
    this.popupComponent.removeElement();
    this.popupComponent.removeCommentSubmitHandler();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hidePopup();
    }
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

  #handleCommentSubmit = (newComment, newEmotion, newCommentId) => {

    this.#changeData(
      UserAction.ADD_COMMENT,
      '',
      { id: newCommentId, author: 'Vasya', comment: newComment, date: '2019-05-02T16:12:32.554Z', emotion: newEmotion }
    );

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.movie, filmCommentsId: [...this.movie.filmCommentsId, newCommentId] },
    );
  };

  #handleDeleteButtonClick = (index, idList) => {

    this.#changeData(
      UserAction.DELETE_COMMENT,
      '',
      index,
    );

    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.movie, filmCommentsId: idList },
    );
  };
}

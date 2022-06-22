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
  isLoading = true;
  #loadingComponent = new LoadingView();
  popupTemplate = null;

  constructor(changeData, commentsModel) {
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#handlePresenterEvent);
  }

  #handlePresenterEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.isLoading = false;
        remove(this.#loadingComponent);
        this.renderPopup();
        break;
    }
  };

  #createPopup = () => {
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

  showPopup = (movie) => {
    this.movie = movie;

    this.#commentsModel.init(this.movie);
  };

  renderPopup = () => {
    this.#createPopup();

    document.body.appendChild(this.popupComponent.element);
    this.popupTemplate = this.popupComponent.element;

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

  #handleCommentSubmit = (newComment, newEmotion) => {

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {
        movie: this.movie,
        comment: {
          comment: newComment,
          emotion: newEmotion,
        }
      }
    );
  };

  #handleDeleteButtonClick = (index) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {
        movie: this.movie,
        index: index,
      }
    );
  };

  setCommentDeleting = (isDisabled = true, isDeleting = true) => {
    this.popupComponent.updateElement({
      isDisabled,
      isDeleting
    });
  };

  setCommentSending = (isSaving = true) => {
    this.popupComponent.updateElement({
      isSaving
    });
  };

  setAborting = () => {
    const popupElement = this.popupComponent.element.querySelector('.film-details__inner');

    const resetFormState = () => {
      this.popupComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.popupComponent.shake(popupElement, resetFormState);
  };
}

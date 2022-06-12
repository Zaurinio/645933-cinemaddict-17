import { render, remove, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import PopupView from '../view/popup-view.js';

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

  constructor(changeData, commentsModel) {
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;


    // this.#changeMode = changeMode;
  }

  #createPopup = () => {

    this.popupComponent = new PopupView(this.movie, this.#commentsModel);

    const prevPopupComponent = this.popupComponent;

    this.popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.popupComponent.setWatchedlistClickHandler(this.#handleWatchedClick);
    this.popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.popupComponent.setCommentSubmitHandler(this.#handleCommentSubmit);
    this.popupComponent.setCommentDeleteHandler(this.#handleDeleteButtonClick);

    this.popupComponent.setCloseButtonClickHandler(this.#hidePopup);

    if (this.mode === Mode.OPENED) {
      // this.createPopup();
      replace(this.popupComponent, prevPopupComponent);
    }
  };

  // resetView = () => {
  //   if (this.#mode !== Mode.CLOSED) {
  //     this.#hidePopup();
  //     this.#mode = Mode.CLOSED;
  //   }
  // };

  showPopup = (movie) => {
    this.movie = movie;

    this.#createPopup();
    // this.#changeMode();
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
    // this.#changeData({ ...this.movie, userDetails: { ...this.movie.userDetails, watchlist: !this.movie.userDetails.watchlist } });
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.movie, userDetails: { ...this.movie.userDetails, watchlist: !this.movie.userDetails.watchlist } },
    );
    // this.movie.userDetails.watchlist = !this.movie.userDetails.watchlist;
  };

  #handleWatchedClick = () => {
    // this.#changeData({ ...this.movie, userDetails: { ...this.movie.userDetails, alreadyWatched: !this.movie.userDetails.alreadyWatched } });
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.movie, userDetails: { ...this.movie.userDetails, alreadyWatched: !this.movie.userDetails.alreadyWatched } },
    );
    // this.movie.userDetails.alreadyWatched = !this.movie.userDetails.alreadyWatched;
  };

  #handleFavoriteClick = () => {
    // this.#changeData({ ...this.movie, userDetails: { ...this.movie.userDetails, favorite: !this.movie.userDetails.favorite } });
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      { ...this.movie, userDetails: { ...this.movie.userDetails, favorite: !this.movie.userDetails.favorite } },
    );
    // this.updateElement({
    //   userDetails: { ...this._state.userDetails, favorite: !this._state.userDetails.favorite },
    // });
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

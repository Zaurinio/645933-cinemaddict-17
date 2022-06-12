// import AbstractView from '../framework/view/abstract-view.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePopupReleaseDate } from '../utils/dates.js';
import { humanizeCommentDate } from '../utils/dates.js';
import { nanoid } from 'nanoid';
import he from 'he';
// import { allComments } from '../mock/comments.js';

const createPopupView = (movie, movieComments) => {
  const { title, totalRating, runtime, genre, description, ageRating, alternativeTitle, director, writers, actors, poster } = movie.filmInfo;
  const { date } = movie.filmInfo.release;
  const { filmCommentsId, newCommentEmotion, newCommentText } = movie;
  const { watchlist, alreadyWatched, favorite } = movie.userDetails;
  const releaseDate = humanizePopupReleaseDate(date);

  const runtimeHours = Math.trunc(Number(runtime) / 60);
  const runtimeMinutes = Number(runtime) % 60;

  const addMovieGenres = () => {
    let element = '';

    for (let i = 0; i < genre.length; i++) {
      element += `<span class="film-details__genre">${genre[i]}</span>`;
    }

    return element;
  };


  const addMovieComments = () => {
    let comments = '';
    for (let i = 0; i < filmCommentsId.length; i++) {
      const element = movieComments.find((comment) => comment.id == filmCommentsId[i]);
      const commentDate = humanizeCommentDate(element.date);

      comments += `<li class="film-details__comment">
                    <span class="film-details__comment-emoji">
                      <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
                    </span>
                    <div>
                      <p class="film-details__comment-text">${he.encode(element.comment)}</p>
                      <p class="film-details__comment-info">
                        <span class="film-details__comment-author">${element.author}</span>
                        <span class="film-details__comment-day">${commentDate}</span>
                        <button type="button" class="film-details__comment-delete">Delete</button>
                      </p>
                    </div>
                  </li>`;
    }

    return comments;
  };

  const addNewMovieComment = () => (
    `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      <img src="images/emoji/${newCommentEmotion}.png" width="55" height="55" alt="emoji-smile">
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" checked>
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </div>`
  );

  return (
    `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="./${poster}" alt="">

                      <p class="film-details__age">${ageRating}+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${totalRating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${releaseDate}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${runtimeHours}h ${runtimeMinutes}m</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">USA</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genres</td>
                        <td class="film-details__cell">
                          ${addMovieGenres()}
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlist ? 'film-details__control-button--active' : null}" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : null}" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : null}" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmCommentsId.length}</span></h3>

                  <ul class="film-details__comments-list">
                    ${addMovieComments()}
                  </ul>
                </section>
                ${addNewMovieComment()};
              </div>
            </form>
          </section>`
  );
};

export default class PopupView extends AbstractStatefulView {
  #commentsModel = null;

  constructor(movie, comments) {
    super();
    this._state = PopupView.parsePopupToState(movie);
    this.#commentsModel = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createPopupView(this._state, this.#commentsModel.commentsList);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #newEmotionHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      newCommentEmotion: evt.target.value,
    });
    this.element.querySelector(`#emoji-${evt.target.value}`).checked = true;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#newEmotionHandler);
    // this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#newCommentHandler);

    this.setCloseButtonClickHandler(this._callback.closeButtonclick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedlistClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCommentDeleteHandler(this._callback.deleteComment);
  };

  // #newCommentHandler = (evt) => {
  //   evt.preventDefault();
  //   // this._setState({
  //   //   newCommentText: evt.target.value,
  //   // });
  // };

  static parsePopupToState = (movie) => ({
    ...movie,
    newCommentEmotion: 'smile',
    newCommentText: 'Great movie!',
  });

  static parseStatetoPopup = (state) => {
    const movie = { ...state };

    delete movie.newCommentEmotion;
    delete movie.newCommentText;

    return movie;
  };

  // setFormSubmitHandler = (callback) => {
  //   this._callback.formSubmit = callback;
  //   document.addEventListener('keydown', this.#formSubmitHandler);
  // };

  // #formSubmitHandler = (evt) => {
  //   evt.preventDefault();
  //   if (evt.ctrlKey && evt.key === 'Enter') {
  //     this._callback.formSubmit(PopupView.parseStatetoPopup(this._state));
  //   }
  // };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonclick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonclick(evt);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedlistClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setCommentSubmitHandler = (callback) => {
    this._callback.commentSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#commentSubmitHandler);
  };

  removeCommentSubmitHandler = () => {
    this.element.querySelector('.film-details__comment-input').removeEventListener('keydown', this.#commentSubmitHandler);
  };

  setCommentDeleteHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => button.addEventListener('click', this.#deleteButtonCLickHandler));
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      userDetails: { ...this._state.userDetails, watchlist: !this._state.userDetails.watchlist },
    });
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      userDetails: { ...this._state.userDetails, alreadyWatched: !this._state.userDetails.alreadyWatched },
    });
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      userDetails: { ...this._state.userDetails, favorite: !this._state.userDetails.favorite },
    });
    this._callback.favoriteClick();
  };

  #commentSubmitHandler = (evt) => {
    if (evt.key === 'Enter' && evt.ctrlKey) {
      evt.preventDefault();

      const newCommentId = nanoid();

      this._state.newCommentText = evt.target.value;

      this._callback.commentSubmit(this._state.newCommentText, this._state.newCommentEmotion, newCommentId);

      this.updateElement({
        ...this._state, filmCommentsId: [...this._state.filmCommentsId, newCommentId]
      }
      );
    }
  };

  #deleteButtonCLickHandler = (evt) => {
    evt.preventDefault();
    const commentsList = [...evt.target.closest('.film-details__comments-list').children];

    const commentIndex = commentsList.findIndex((elem) => elem === evt.target.closest('.film-details__comment'));

    const commentsIdList = [
      ...this._state.filmCommentsId.slice(0, commentIndex),
      ...this._state.filmCommentsId.slice(commentIndex + 1),
    ];

    this._callback.deleteComment(commentIndex, commentsIdList);

    this.updateElement({
      ...this._state, filmCommentsId: [...commentsIdList]
    }
    );
  };
}

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePopupReleaseDate } from '../utils/dates.js';
import { humanizeCommentDate } from '../utils/dates.js';
import he from 'he';

const createPopupView = (movie, movieComments) => {
  const { title, totalRating, runtime, genres, description, watchlist, alreadyWatched, favorite, date, ageRating, alternativeTitle, director, writers, actors, poster, releaseCountry, comments, isDisabled, isSaving, isDeleting } = movie;
  const releaseDate = humanizePopupReleaseDate(date);
  const newCommentEmotion = movie.newCommentEmotion;
  const newCommentText = movie.newCommentText;

  const runtimeHours = Math.trunc(Number(runtime) / 60);
  const runtimeMinutes = Number(runtime) % 60;

  const addMovieGenres = () => {
    let element = '';

    for (let i = 0; i < genres.length; i++) {
      element += `<span class="film-details__genre">${genres[i]}</span>`;
    }

    return element;
  };


  const addMovieComments = () => {
    let commentsElement = '';
    for (let i = 0; i < comments.length; i++) {
      const element = movieComments.find((com) => com.id === comments[i]);
      if (!element) {
        continue;
      }
      const { emotion, comment, author } = element;
      const commentDate = humanizeCommentDate(element.date);

      commentsElement += `<li class="film-details__comment">
                    <span class="film-details__comment-emoji">
                      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
                    </span>
                    <div>
                      <p class="film-details__comment-text">${he.encode(comment)}</p>
                      <p class="film-details__comment-info">
                        <span class="film-details__comment-author">${author}</span>
                        <span class="film-details__comment-day">${commentDate}</span>
                        <button type="button" class="film-details__comment-delete" ${isDeleting ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
                      </p>
                    </div>
                  </li>`;
    }

    return commentsElement;
  };

  const addNewMovieComment = () => (
    `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      <img src="images/emoji/${newCommentEmotion}.png" width="55" height="55" alt="emoji-smile">
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSaving ? 'disabled' : ''}>${newCommentText}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${newCommentEmotion === 'smile' ? 'checked' : ''}>
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${newCommentEmotion === 'sleeping' ? 'checked' : ''}>
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${newCommentEmotion === 'puke' ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${newCommentEmotion === 'angry' ? 'checked' : ''}>
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
                        <td class="film-details__cell">${releaseCountry}</td>
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
                  <button type="button" ${isDisabled ? 'disabled' : ''} class="film-details__control-button film-details__control-button--watchlist ${watchlist ? 'film-details__control-button--active' : null}" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" ${isDisabled ? 'disabled' : ''} class="film-details__control-button film-details__control-button--watched ${alreadyWatched ? 'film-details__control-button--active' : null}" id="watched" name="watched">Already watched</button>
                  <button type="button" ${isDisabled ? 'disabled' : ''} class="film-details__control-button film-details__control-button--favorite ${favorite ? 'film-details__control-button--active' : null}" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

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
    return createPopupView(this._state, this.#commentsModel);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #newEmotionHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      newCommentEmotion: evt.target.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#newEmotionHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#newCommentHandler);

    this.setCloseButtonClickHandler(this._callback.closeButtonclick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedlistClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCommentSubmitHandler(this._callback.commentSubmit);
    this.setCommentDeleteHandler(this._callback.deleteComment);
  };

  #newCommentHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      newCommentText: evt.target.value,
    });
  };

  static parsePopupToState = (movie) => ({
    ...movie,
    newCommentEmotion: 'smile',
    newCommentText: 'Great movie!',
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStatetoPopup = (state) => {
    const movie = { ...state };

    delete movie.newCommentEmotion;
    delete movie.newCommentText;

    return movie;
  };

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
      ...this._state, watchlist: !this._state.watchlist
    });
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state, alreadyWatched: !this._state.alreadyWatched
    });
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state, favorite: !this._state.favorite
    });
    this._callback.favoriteClick();
  };

  #commentSubmitHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();

      this._state.newCommentText = evt.target.value;

      this._callback.commentSubmit(this._state.newCommentText, this._state.newCommentEmotion);
    }
  };

  #deleteButtonCLickHandler = (evt) => {
    evt.preventDefault();
    const commentsList = [...evt.target.closest('.film-details__comments-list').children];

    const commentIndex = commentsList.findIndex((elem) => elem === evt.target.closest('.film-details__comment'));

    const commentsIdList = [
      ...this._state.comments.slice(0, commentIndex),
      ...this._state.comments.slice(commentIndex + 1),
    ];

    this._callback.deleteComment(commentIndex);

    this.updateElement({
      ...this._state, filmCommentsId: [...commentsIdList]
    }
    );
  };
}

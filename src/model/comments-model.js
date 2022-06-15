import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class СommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get commentsList() {
    return this.#comments;
  }

  init = async (movie) => {
    try {
      this.#comments = await this.#commentsApiService.getComments(movie);
    } catch (err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  };

  addComment = (updateType, update) => {

    this.#comments = [
      ...this.#comments,
      update,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {

    this.#comments = [
      ...this.#comments.slice(0, update),
      ...this.#comments.slice(update + 1),
    ];

    this._notify(updateType, update);
  };
}

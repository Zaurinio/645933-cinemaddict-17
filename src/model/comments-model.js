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

  addComment = async (updateType, update) => {
    const { movie, comment } = update;
    try {
      const response = await this.#commentsApiService.addComment(movie, comment);
      this.#comments = response.comments;
      const updatedMovie = response.movie;
      this._notify(updateType, updatedMovie);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const { index } = update;
    const { comments } = update.movie;
    try {
      await this.#commentsApiService.deleteComment(comments[index]);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, update.movie);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };
}

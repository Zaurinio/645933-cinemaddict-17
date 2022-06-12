import Observable from '../framework/observable.js';
import { allComments } from '../mock/comments.js';

export default class commentsModel extends Observable {
  comments = allComments;

  get commentsList() {
    return this.comments;
  }

  addComment = (updateType, update) => {

    this.comments = [
      ...this.comments,
      update,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {

    this.comments = [
      ...this.comments.slice(0, update),
      ...this.comments.slice(update + 1),
    ];

    this._notify(updateType, update);
  };
}

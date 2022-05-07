import PopupView from '../view/popup-view.js';
import { render } from '../render.js';

export default class PopupPresenter {
  #popupContainer = null;
  #moviesModel = null;
  #pageMovies = [];

  init = (popupContainer, moviesModel) => {
    this.#popupContainer = popupContainer;
    this.#moviesModel = moviesModel;
    this.#pageMovies = [...this.#moviesModel.movies];

    render(new PopupView(this.#pageMovies[0]), this.#popupContainer);
  };
}

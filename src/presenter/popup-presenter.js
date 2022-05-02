import PopupView from '../view/popup-view.js';
import { render } from '../render.js';

export default class PopupPresenter {
  init = (popupContainer, moviesModel) => {
    this.popupContainer = popupContainer;
    this.moviesModel = moviesModel;
    this.pageMovies = [...this.moviesModel.getMovies()];

    render(new PopupView(this.pageMovies[0]), this.popupContainer);
  };
}

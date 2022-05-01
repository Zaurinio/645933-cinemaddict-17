import PopupView from '../view/popup-view.js';
import { render } from '../render.js';

export default class PopupPresenter {
  init = (popupContainer) => {
    this.popupContainer = popupContainer;
    render(new PopupView(), this.popupContainer);
  };
}

import { createElement } from '../render.js';

const createFilmListView = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmListView {
  #element = null;

  get template() {
    return createFilmListView();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  deleteElement() {
    this.#element = null;
  }
}

import { createElement } from '../render.js';

const createFilmListView = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmListView {
  getTemplate() {
    return createFilmListView();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  deleteElement() {
    this.element = null;
  }
}

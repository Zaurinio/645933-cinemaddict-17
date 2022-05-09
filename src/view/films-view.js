import { createElement } from '../render.js';

const createFilmsView = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`

);

export default class FilmsView {
  #element = null;

  get template() {
    return createFilmsView();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get filmsListContainer() {
    return this.#element.querySelector('.films-list__container');
  }

  get filmsList() {
    return this.#element.querySelector('.films-list');
  }

  deleteElement() {
    this.#element = null;
  }
}

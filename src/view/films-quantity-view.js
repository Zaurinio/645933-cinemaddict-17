import { createElement } from '../render.js';

const createFilmsQuantity = () => (
  `<section class="footer__statistics">
  <p>130 291 movies inside</p>
  </section>`
);

export default class FilmsQuantityView {
  #element = null;

  get template() {
    return createFilmsQuantity();
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

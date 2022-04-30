import { createElement } from '../render.js';

const createFilmsQuantity = () => (
  `<section class="footer__statistics">
  <p>130 291 movies inside</p>
  </section>`
);

export default class FilmsQuantityView {
  getTemplate() {
    return createFilmsQuantity();
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

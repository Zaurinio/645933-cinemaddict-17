import AbstractView from '../framework/view/abstract-view.js';

const createFilmsQuantity = (quantity) => (
  `<section class="footer__statistics">
  <p>${quantity} movies inside</p>
  </section>`
);

export default class FilmsQuantityView extends AbstractView {
  #quantity = null;

  constructor(quantity) {
    super();
    this.#quantity = quantity;
  }

  get template() {
    return createFilmsQuantity(this.#quantity);
  }
}

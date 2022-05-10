import AbstractView from '../framework/view/abstract-view.js';

const createFilmsQuantity = () => (
  `<section class="footer__statistics">
  <p>130 291 movies inside</p>
  </section>`
);

export default class FilmsQuantityView extends AbstractView {
  get template() {
    return createFilmsQuantity();
  }
}

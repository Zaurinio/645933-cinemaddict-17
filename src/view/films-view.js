import AbstractView from '../framework/view/abstract-view.js';

const createFilmsView = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`

);

export default class FilmsView extends AbstractView {
  get template() {
    return createFilmsView();
  }

  get filmsListContainer() {
    return this.element.querySelector('.films-list__container');
  }

  get filmsList() {
    return this.element.querySelector('.films-list');
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.filmsListContainer.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };
}

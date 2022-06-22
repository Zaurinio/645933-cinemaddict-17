import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const emptyPageText = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyPageTemplate = (filter) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${emptyPageText[filter]}</h2>
    </section >
  </section > `
);


export default class EmptyPageView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPageTemplate(this.#filterType);
  }
}

import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  return (name === 'All movies' ?
    `<a
  href="#${type}"
  class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
  data-filter-type="${type}">
    ${name}
  </a>`
    : `<a
    href="#${type}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
  </a>`);
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
  </nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const targetElement = evt.target.tagName === 'A' ? evt.target : evt.target.parentElement;
    this._callback.filterTypeChange(targetElement.dataset.filterType);
  };
}

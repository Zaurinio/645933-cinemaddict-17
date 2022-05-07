import FilmListView from '../view/film-list-view.js';
import FilmView from '../view/film-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PopupView from '../view/popup-view';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { render } from '../render.js';

export default class PagePresenter {
  #filmListComponent = new FilmListView();
  #pageContainer = null;
  #moviesModel = null;
  #pageMovies = [];
  #popupContainer = null;

  init = (pageContainer, moviesModel) => {
    this.#pageContainer = pageContainer;
    this.#moviesModel = moviesModel;
    this.#pageMovies = [...this.#moviesModel.movies];

    render(new FilterView(), this.#pageContainer);
    render(new SortView(), this.#pageContainer);
    render(this.#filmListComponent, this.#pageContainer);
    render(new ShowMoreButtonView(), this.#pageContainer);

    for (let i = 0; i < this.#pageMovies.length; i++) {
      render(new FilmView(this.#pageMovies[i]), this.#filmListComponent.element);
    }

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        hidePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const showPopup = (evt) => {
      const filmCard = evt.target.closest('.film-card__link');
      if (filmCard) {
        const movieId = filmCard.dataset.id;
        document.body.appendChild(new PopupView(this.#pageMovies[movieId]).element);
        document.body.classList.add('hide-overflow');
        document.addEventListener('keydown', onEscKeyDown);
      }
    };

    function hidePopup() {
      document.body.querySelector('.film-details').remove();
      document.body.classList.remove('hide-overflow');
    }

    document.body.querySelector('.films-list__container').addEventListener('click', (evt) => {
      showPopup(evt);
      document.querySelector('.film-details__close-btn').addEventListener('click', hidePopup);
    });
  };
}

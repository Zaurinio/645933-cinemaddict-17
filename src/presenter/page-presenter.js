import FilmListView from '../view/film-list-view.js';
import FilmView from '../view/film-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { render } from '../render.js';

export default class PagePresenter {
  filmListComponent = new FilmListView();

  init = (pageContainer) => {
    this.pageContainer = pageContainer;
    const FILM_CARDS_QTY = 5;

    render(new FilterView(), this.pageContainer);
    render(new SortView(), this.pageContainer);
    render(this.filmListComponent, this.pageContainer);
    render(new ShowMoreButtonView(), this.pageContainer);

    for (let i = 0; i < FILM_CARDS_QTY; i++) {
      render(new FilmView(), this.filmListComponent.getElement());
    }
  };
}

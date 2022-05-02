import FilmListView from '../view/film-list-view.js';
import FilmView from '../view/film-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { render } from '../render.js';

export default class PagePresenter {
  filmListComponent = new FilmListView();

  init = (pageContainer, moviesModel) => {
    this.pageContainer = pageContainer;
    this.moviesModel = moviesModel;
    this.pageMovies = [...this.moviesModel.getMovies()];


    render(new FilterView(), this.pageContainer);
    render(new SortView(), this.pageContainer);
    render(this.filmListComponent, this.pageContainer);
    render(new ShowMoreButtonView(), this.pageContainer);

    for (let i = 0; i < this.pageMovies.length; i++) {
      render(new FilmView(this.pageMovies[i]), this.filmListComponent.getElement());
    }
  };
}

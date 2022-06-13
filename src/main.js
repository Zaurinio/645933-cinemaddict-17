import ProfileView from './view/user-profile-view.js';
import FilmsQuantityView from './view/films-quantity-view.js';
import PagePresenter from './presenter/page-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import { render } from './framework/render.js';
import CommentsModel from './model/comments-model.js';

const siteMainElement = document.querySelector('.main');
const headerMainElement = document.querySelector('.header');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const pagePresenter = new PagePresenter(siteMainElement, moviesModel, filterModel, commentsModel);


render(new ProfileView(), headerMainElement);
render(new FilmsQuantityView(), footerStatisticsElement);

filterPresenter.init();
pagePresenter.init();


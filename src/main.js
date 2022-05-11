import ProfileView from './view/user-profile-view.js';
import FilmsQuantityView from './view/films-quantity-view.js';
import PagePresenter from './presenter/page-presenter.js';
import MoviesModel from './model/movies-model.js';
import { render } from './framework/render.js';

const siteMainElement = document.querySelector('.main');
const headerMainElement = document.querySelector('.header');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const pagePresenter = new PagePresenter();
const moviesModel = new MoviesModel();

render(new ProfileView(), headerMainElement);
render(new FilmsQuantityView(), footerStatisticsElement);

pagePresenter.init(siteMainElement, moviesModel);


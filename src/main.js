import UserProfileView from './view/user-profile-view.js';
import FilmsQuantityView from './view/films-quantity-view.js';
import PagePresenter from './presenter/page-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import { render } from './framework/render.js';
import CommentsModel from './model/comments-model.js';
import MoviesApiService from './movies-api-service.js';
import CommentsApiService from './comments-api-service.js';

const AUTHORIZATION = 'Basic df5456dHSDf54dfs';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const headerMainElement = document.querySelector('.header');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const moviesModel = new MoviesModel(new MoviesApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const pagePresenter = new PagePresenter(siteMainElement, moviesModel, filterModel, commentsModel);


render(new UserProfileView(), headerMainElement);
render(new FilmsQuantityView(), footerStatisticsElement);

filterPresenter.init();
pagePresenter.init();
moviesModel.init();

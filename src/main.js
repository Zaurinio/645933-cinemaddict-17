import ProfileView from './view/user-profile-view.js';
import FilmsQuantityView from './view/films-quantity-view.js';
import PagePresenter from './presenter/page-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import { render } from './render.js';

const siteMainElement = document.querySelector('.main');
const headerMainElement = document.querySelector('.header');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const bodyMainElement = document.querySelector('body');
const pagePresenter = new PagePresenter();
const popupPresenter = new PopupPresenter();

render(new ProfileView(), headerMainElement);
render(new FilmsQuantityView(), footerStatisticsElement);

pagePresenter.init(siteMainElement);
popupPresenter.init(bodyMainElement);

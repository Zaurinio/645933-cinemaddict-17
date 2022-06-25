import AbstractView from '../framework/view/abstract-view.js';
import { checkProfileRating } from '../utils/profile-status.js';

const createProfileTemplate = (movies) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${checkProfileRating(movies)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`
);

export default class UserProfileView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createProfileTemplate(this.#movies);
  }
}

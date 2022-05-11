import AbstractView from '../framework/view/abstract-view.js';

const createEmptyPageTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);


export default class EmptyPageView extends AbstractView {
  get template() {
    return createEmptyPageTemplate();
  }
}

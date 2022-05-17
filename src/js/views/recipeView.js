import View from './View.js';

import icons from 'url:../../assets/svg/sprite.svg';
import fracty from 'fracty';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => {
      window.addEventListener(ev, handler);
    });
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    const markup = `<div class="recipe pageRecipe__recipe">
              
    <figure class="recipe__fig pageRecipe__fig">
      <img
        src="${this._data.image}"
        alt="${this._data.title}"
        class="recipe__img"
      />
      <h1 class="recipe__title">
        <span class="recipe__title__span"
          >${this._data.title}</span
        >
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info recipe__time">
        <svg class="recipe__info-icon icon-primary">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes"
          >${this._data.cookingTime}</span
        >
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info recipe__servings">
        <svg class="recipe__info-icon icon-primary">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people"
          >${this._data.servings}</span
        >
        <span class="recipe__info-text">${
          this._data.servings === 1 ? 'serving' : 'servings'
        }</span>

        <div class="recipe__info-buttons">
          <button
            class="btn-ops btn--decrease-servings btn--update-servings" data-update-to="${
              this._data.servings - 1
            }"
          >
            <svg class="icon-white recipe__svg-ops">
              <use href="${icons}#icon-minus"></use>
            </svg>
          </button>
          <button
            class="btn-ops btn--increase-servings btn--update-servings" data-update-to="${
              this._data.servings + 1
            }"
          >
            <svg class="icon-white recipe__svg-ops">
              <use href="${icons}#icon-plus"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__pins">
        <div class="recipe__user-generated ${this._data.key ? '' : ' hidden'}">
          <svg class="icon-bookmarked recipe__user-generated__svg">
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn-ops recipe__bookmarks btn--bookmark ${
          this._data.key ? '' : 'bookmark-position'
        }">
          <svg class="${
            this._data.bookmarked ? 'icon-bookmarked' : 'icon-white'
          }">
            <use href="${icons}#icon-heart${
      this._data.bookmarked ? '' : ''
    }"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading-2 recipe__ingredients__heading">
        Recipe ingredients
      </h2>
      <ul class="recipe__ingredient-list">
      ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading-2 recipe__directions__heading">
        How to cook it
      </h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${this._data.publisher}</span>.
        Please check out directions at their website.
      </p>
      <a
        class="btn-cta recipe__btn-directions"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
      </a>
    </div>
  </div>`;
    return markup;
  }

  _generateMarkupIngredient(ing) {
    const markup = `<li class="recipe__ingredient">
    <svg class="recipe__icon icon-primary">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity ? fracty(ing.quantity) : ''
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>`;

    return markup;
  }
}

export default new RecipeView();

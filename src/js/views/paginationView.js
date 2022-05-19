import View from './View.js';

import icons from 'url:../../assets/svg/sprite.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.pagination__btn');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const prevButton = `<button data-goto= "${curPage - 1}"
    class="btn-text--primary pagination__btn--prev pagination__btn"
  >
    <svg class="pagination__icon icon-primary">
      <use
        href="${icons}#icon-arrow-left2"
      ></use>
    </svg>
    <span class="pagination__text">Page ${curPage - 1}</span>
  </button>`;

    const nextButton = `<button data-goto= "${curPage + 1}"
    class="btn-text--primary pagination__btn--next pagination__btn"
  >
    <span class="pagination__text">Page ${curPage + 1}</span>
    <svg class="pagination__icon icon-primary">
      <use
        href="${icons}#icon-arrow-right2"
      ></use>
    </svg>
  </button>`;

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return nextButton;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return prevButton;
    }

    // Other page
    if (curPage < numPages) {
      return `${prevButton} ${nextButton}`;
    }

    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();

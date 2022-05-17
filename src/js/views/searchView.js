class SearchView {
  _parentEl = document.querySelector('.search');

  _featureEl1 = document.querySelector('.btn-feature--1');
  _featureEl2 = document.querySelector('.btn-feature--2');
  _featureEl3 = document.querySelector('.btn-feature--3');
  _featureEl4 = document.querySelector('.btn-feature--4');

  getQuery() {
    const query = this._parentEl.querySelector('.search__input').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__input').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  addHandlerTypesSearch(handler, element) {
    element.addEventListener('click', function () {
      handler();
    });
  }
}

export default new SearchView();

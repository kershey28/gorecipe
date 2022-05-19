import icons from 'url:../../assets/svg/sprite.svg';

export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] If false, create a markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Kershey Carino
   * @todo Finish implementation
   */

  render(data, render = true) {
    // Guard clause; to check also if the Arr has items
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear(element = this._parentElement) {
    element.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="cooking spinner">
    <h1 class="cooking__text">Cooking in progress..</h1>
    <div class="cooking__cook">
      <div class="cooking__bubble"></div>
      <div class="cooking__bubble"></div>
      <div class="cooking__bubble"></div>
      <div class="cooking__bubble"></div>
      <div class="cooking__bubble"></div>
      <div class="cooking__area">
        <div class="cooking__sides">
          <div class="cooking__pan"></div>
          <div class="cooking__handle"></div>
        </div>
        <div class="cooking__pancake">
          <div class="cooking__pastry"></div>
        </div>
      </div>
    </div>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage, element = this._parentElement) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-warning"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear(element);
    element.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message, element = this._parentElement) {
    const markup = `<div class="message recipe__message">
    <div>
      <svg class="icon">
        <use href="${icons}#icon-hand"></use>
      </svg>
    </div>
    <p>
    ${message}
    </p>
  </div>`;
    this._clear(element);
    element.insertAdjacentHTML('afterbegin', markup);
  }

  renderErrorFast(message = this._errorMessage) {
    const markup = `<div class="error-user error remove-error">
    <div>
      <svg>
        <use href="${icons}#icon-warning"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._window.insertAdjacentHTML('afterbegin', markup);
  }
}

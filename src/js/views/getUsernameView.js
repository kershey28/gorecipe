import View from './View.js';
import { state, transitionToDash } from '../model.js';
import { CHAR_USER_MIN } from '../config';

import icons from 'url:../../assets/svg/sprite.svg';

class GetUsernameView extends View {
  _parentElement = document.querySelector('.form-user__content');
  _message = 'What an awful name you have! Anyway...';
  _errorMessage = 'Please enter your name!';

  _window = document.querySelector('.form-user');
  _overlay = document.querySelector('.overlay-user');
  _btnOpen = document.querySelector('.btn-start');
  _btnClose = document.querySelector('.btn--close-modal-user');
  _display = document.querySelector('.username');

  username = document.querySelector('.form-user__input');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  toggleTransition() {
    this.displayData(state.username);
    transitionToDash();
  }

  _addHandlerShowWindow() {
    if (state.username) {
      this._btnOpen.addEventListener('click', this.toggleTransition.bind(this));
    }

    if (!state.username) {
      this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUsername(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = this.username.value;
      const usernameCount = username.length;

      const formCon = document.querySelector('.form-user');
      const formInput = document.querySelector('.form-user__input');
      const errorMessage = 'Name must be at least 4 characters long to join!';
      const markup = `<div class="error-user error remove-error">
        <div>
          <svg>
            <use href="${icons}#icon-warning"></use>
          </svg>
        </div>
        <p>${errorMessage}</p>
      </div>`;

      if (usernameCount < CHAR_USER_MIN) {
        // Clear Input
        formInput.value = '';
        formInput.blur();

        // Render Error
        formCon.insertAdjacentHTML('afterbegin', markup);
      } else {
        // Set Username
        state.username = username;
        handler(username);
      }
    });
  }

  displayData(data) {
    this._display.textContent = '';
    this._display.textContent = data;
  }
}

export default new GetUsernameView();

import View from './View.js';
import { state, transitionToDash } from '../model.js';

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
    //   scrollInto(this._window);
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
      state.username = username;
      handler(username);
    });
  }

  displayData(data) {
    this._display.textContent = '';
    this._display.textContent = data;
  }
}

export default new GetUsernameView();

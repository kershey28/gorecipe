import View from './View.js';
import { setDateUpload, state } from './../model';
import { UPLOAD_LIMIT } from './../config';

import icons from 'url:../../assets/svg/sprite.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _errorMessage = 'Fuck you!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay-recipe');
  _btnOpen = document.querySelector('.btn-add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _scroll = document.querySelector('.features');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    // this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validation to Check Upload Limit
      if (UPLOAD_LIMIT === state.uploadCount) {
        const formCon = document.querySelector('.upload');
        const errorMessage =
          'Upload limit for today has been reached! You can upload again tomorrow :)';
        const markup = `<div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-warning"></use>
            </svg>
          </div>
          <p>${errorMessage}</p>
        </div>`;

        // Render Error
        formCon.innerHTML = '';
        formCon.insertAdjacentHTML('afterbegin', markup);

        // Setting a One-day Ban for the User
        setDateUpload();

        return;
      }

      // Validation Passed!
      else {
        const dataArr = [...new FormData(this)];
        const data = Object.fromEntries(dataArr);

        // Increase Upload Count
        ++state.uploadCount;
        localStorage.setItem('uploadCount', JSON.stringify(state.uploadCount));
        handler(data);
      }
    });
  }
}

export default new AddRecipeView();

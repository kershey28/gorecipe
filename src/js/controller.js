'use strict';

////////////////////////////////////////////////////////////////////////////////
////////////////////////// CONTROLLER  //////////////////////////////////////////
import * as model from './model.js';
import * as helpers from './helpers.js';
import * as config from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import getUsernameView from './views/getUsernameView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

/***************************** Functionality ********************************/

// Recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating Bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading Recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 3) Rendering Recipe
    recipeView.render(model.state.recipe);

    // 4) Transition
    model.transitionToRecipe();
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

// Search
const controlSearchResults = async function () {
  const results = document.querySelector('.results');
  const inputSearch = document.querySelector('.search__input');

  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Blur Input before Scroll
    inputSearch.blur();

    // 3) Scroll into Results
    setTimeout(function () {
      helpers.scrollIntoPosition('results');
    }, 1000);

    // 4) Switch to Grid Layout
    if (!alreadyClickSearch) {
      results.classList.remove('intro-flex');
      results.classList.add('grid');
    }

    //set the state
    alreadyClickSearch = true;

    // 5) Load search results
    await model.loadSearchResults(query);

    // 6) Render results
    resultsView.render(model.getSearchResultsPage());

    // 7) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

export const controlSearchTypesResults = async function (type) {
  const results = document.querySelector('.results');

  try {
    resultsView.renderSpinner();

    // 1) Scroll into Results
    helpers.scrollIntoPosition('results');

    // 2) Switch to Grid Layout
    if (!alreadyClickSearch) {
      results.classList.remove('intro-flex');
      results.classList.add('grid');
    }

    //set the state
    alreadyClickSearch = true;

    // 3) Load search results
    await model.loadSearchResults(type);

    // 4) Render results
    resultsView.render(model.getSearchResultsPage());

    // 5) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Feature Search
const controlSearchTypesResults1 = () =>
  controlSearchTypesResults('cheesecake');
const controlSearchTypesResults2 = () => controlSearchTypesResults('chicken');
const controlSearchTypesResults3 = () => controlSearchTypesResults('paella');
const controlSearchTypesResults4 = () => controlSearchTypesResults('avocado');

// Pagination
const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) Update the recipe servings (in state)
  model.updateServings(newServings);

  // 2) Update the recipe view
  recipeView.update(model.state.recipe);
};

// Bookmarks
const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Add recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // 1) Show loading spinner
    addRecipeView.renderSpinner();

    // 2) Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // 3) Render recipe
    recipeView.render(model.state.recipe);

    // 4) Result message
    addRecipeView.renderMessage();

    // 5) Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // 6) Scroll into Window
    helpers.scrollIntoPosition('form-user');

    // 7) Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, config.MODAL_CLOSE_SEC * 1000);

    // 8) Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 9) Setting a bug-fixer from Upload (due to deleted innerHTML)
    uploadedARecipe = true;

    // 10) Transition to Recipe
    setTimeout(model.transitionToRecipe, config.TRANSITION_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

// Username
const controlUsername = username => {
  const formUserCon = document.querySelector('.form-user__container');

  if (username) {
    // 1) Display Message
    getUsernameView.renderMessage(undefined, formUserCon);

    // 2) Set into Local Storage
    model.setUsername();

    // 3) Transition to Dashboard
    setTimeout(model.transitionToDash, config.TRANSITION_SEC * 1000);

    // 4) Display Username
    getUsernameView.displayData(username);
  }
  if (!username) {
    getUsernameView.renderErrorFast();
  }
};

// Animation
const controlAnimation = () => {
  const cardFeatures = document.querySelectorAll('.card-float');

  const cardObserver = new IntersectionObserver(helpers.animateCard, {
    root: null,
    threshold: 1,
  });

  cardFeatures.forEach(section => {
    cardObserver.observe(section);
  });
};

/***************************** States ********************************/

// Setting a bug-fixer from Upload (due to deleted innerHTML)
export let uploadedARecipe = false;

// To Switch the Results's Layout to Grid Once
let alreadyClickSearch = false;

/***************************** Initialization ********************************/

const init = function () {
  // Buttons
  const btnBack = document.querySelector('.btn-back');
  const btnReset = document.querySelector('.btn-reset');

  //Features
  const featureEl1 = document.querySelector('.btn-feature--1');
  const featureEl2 = document.querySelector('.btn-feature--2');
  const featureEl3 = document.querySelector('.btn-feature--3');
  const featureEl4 = document.querySelector('.btn-feature--4');

  //Functionality
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  getUsernameView.addHandlerUsername(controlUsername);

  //Features
  searchView.addHandlerTypesSearch(controlSearchTypesResults1, featureEl1);
  searchView.addHandlerTypesSearch(controlSearchTypesResults2, featureEl2);
  searchView.addHandlerTypesSearch(controlSearchTypesResults3, featureEl3);
  searchView.addHandlerTypesSearch(controlSearchTypesResults4, featureEl4);

  //Buttons
  btnBack.addEventListener('click', model.transitionBackToDash);
  btnReset.addEventListener('click', model.resetData);

  //Misc
  helpers.removeHashURL();
  controlAnimation();
  model.setDateLog();
  model.setUploadCount();
};

init();

//TEST
console.log('TESTTTTT');
console.log(model.state);

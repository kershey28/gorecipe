'use strict';

////////////////////////////////////////////////////////////////////////////////
////////////////////////// Elements ////////////////////////////////////////////

// Main Containers
const homeDOM = document.getElementById('home');
const appDOM = document.getElementById('app');
const pageDashboardDOM = document.getElementById('pageDashboard');
const pageRecipeDOM = document.getElementById('pageRecipe');
const heroDOM = document.getElementById('hero');

//Elements
const results = document.querySelector('.search-results');
const recipeWindow = document.querySelector('.add-recipe-window');
const cardFeatures = document.querySelectorAll('.card-float');

// Buttons
const btnStart = document.querySelector('.btn-start');
const btnBack = document.querySelector('.btn-back');
const btnReset = document.querySelector('.btn-reset');

//Features
const featureEl1 = document.querySelector('.btn-feature--1');
const featureEl2 = document.querySelector('.btn-feature--2');
const featureEl3 = document.querySelector('.btn-feature--3');
const featureEl4 = document.querySelector('.btn-feature--4');
/*
API KEY: 99451a66-ba42-4f25-8f92-b6b515cce6f4
 */

////////////////////////////////////////////////////////////////////////////////
////////////////////////// Functions  //////////////////////////////////////////

////////  Transition In  ////////

// const transitionToRecipe = e => {
//   e.preventDefault();
//   pageDashboardDOM.classList.remove('page-transition-in');
//   pageRecipeDOM.classList.add('page-transition-in');
//   pageRecipeDOM.classList.add('page-transition-in-margin');
// };

// const transitionBackToDash = () => {
//   pageDashboardDOM.classList.add('page-transition-in');
//   pageRecipeDOM.classList.remove('page-transition-in');
//   pageRecipeDOM.classList.remove('page-transition-in-margin');
// };

/***************************** Event Listeners ********************************/

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

/***************************** Transitions ********************************/

const transitionToRecipe = () => {
  pageDashboardDOM.classList.remove('page-transition-in');
  pageRecipeDOM.classList.add('page-transition-in');
  pageRecipeDOM.classList.add('page-transition-in-margin');

  //to fix the error for modal
  pageDashboardDOM.classList.remove('pageDash-minHeight');

  //scroll
  helpers.scrollInto(pageRecipeDOM);
};
let uploadedARecipe = false;
const transitionBackToDash = () => {
  if (!uploadedARecipe) {
    pageDashboardDOM.classList.add('page-transition-in');
    pageRecipeDOM.classList.remove('page-transition-in');
    pageRecipeDOM.classList.remove('page-transition-in-margin');
    helpers.removeHashURL();

    //to fix the error for modal
    pageDashboardDOM.classList.add('pageDash-minHeight');
  }

  //fix error from Recipe Upload
  if (uploadedARecipe) {
    location.reload();
  }
};

/***************************** Transition Handlers ********************************/
// btnStart.addEventListener('click', transitionToDash);
btnBack.addEventListener('click', transitionBackToDash);
btnReset.addEventListener('click', model.resetData);

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

    //Transition
    transitionToRecipe();
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

// Search
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Scroll into Results
    helpers.scrollInto(results);

    // 2) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 3) Load search results
    await model.loadSearchResults(query);

    // 4) Render results
    resultsView.render(model.getSearchResultsPage());

    // 5) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

export const controlSearchTypesResults = async function (type) {
  try {
    resultsView.renderSpinner();

    // 1) Scroll into Results
    helpers.scrollInto(results);

    // 2) Load search results
    await model.loadSearchResults(type);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
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
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
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
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Result message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Scroll into Window
    helpers.scrollInto(recipeWindow);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, config.MODAL_CLOSE_SEC * 1000);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Transition to Recipe
    setTimeout(transitionToRecipe, config.TRANSITION_SEC * 3000);

    //setting a bug-fixer from Upload
    uploadedARecipe = true;
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

// Username
const controlUsername = username => {
  if (username) {
    // Display Message
    getUsernameView.renderMessage();

    // Set into Local Storage
    model.setUsername();

    // Transition to Dashboard
    setTimeout(model.transitionToDash, config.TRANSITION_SEC * 3000);

    // Display Username
    getUsernameView.displayData(username);
  }
  if (!username) {
    getUsernameView.renderErrorFast();
  }
};

// Animation
const controlAnimation = () => {
  const cardObserver = new IntersectionObserver(helpers.animateCard, {
    root: null,
    threshold: 1,
  });

  cardFeatures.forEach(section => {
    cardObserver.observe(section);
  });
};

const init = function () {
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

  //Misc
  helpers.removeHashURL();
  controlAnimation();
};

init();

// TEST
console.log('testt');

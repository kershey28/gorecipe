import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
import { AJAX, removeHashURL, scrollIntoPosition } from './helpers.js';
import { uploadedARecipe } from './controller.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/***************************** Production ********************************/

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 💥 💥 💥 💥`);
    throw err;
  }
};

/***************************** Search Recipe ********************************/

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥 💥 💥 💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9
  return state.search.results.slice(start, end);
};

/***************************** Servings ********************************/

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQuantity = oldQuantity * newServings / oldServings ||| 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

/***************************** Bookmarks ********************************/

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

export const clearBookmarks = function () {
  // localStorage.clear('bookmarks');
  localStorage.removeItem('bookmarks');
};
// clearBookmarks();

/***************************** Username ********************************/

export const setUsername = function () {
  localStorage.setItem('username', JSON.stringify(state.username));
};

const clearUsername = function () {
  localStorage.removeItem('username');
};

export const resetData = () => {
  clearBookmarks();
  clearUsername();
  location.reload();
};

/***************************** Date ********************************/

export const setDateLog = () => {
  const date = new Date();
  state.dateLog = date.getDay();
};

export const setDateUpload = () => {
  const date = new Date();
  state.dateUpload = date.getDay();
  localStorage.setItem('dateUpload', JSON.stringify(state.dateUpload));
};

export const setUploadCount = () => {
  if (state.uploadCount) {
    setUploadCountReset();
    return;
  }
  if (!state.uploadCount) {
    state.uploadCount = 0;
  }
};

export const setUploadCountReset = () => {
  if (!state.dateUpload || state.dateLog === state.dateUpload) return;
  else {
    state.uploadCount = 0;
    localStorage.setItem('uploadCount', JSON.stringify(state.uploadCount));
  }
};

/***************************** Initialization Storage ********************************/

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  const storageUsername = localStorage.getItem('username');
  const storageDateUpload = localStorage.getItem('dateUpload');
  const storageUploadCount = localStorage.getItem('uploadCount');

  if (storage) state.bookmarks = JSON.parse(storage);
  if (storageUsername) state.username = JSON.parse(storageUsername);
  if (storageDateUpload) state.dateUpload = JSON.parse(storageDateUpload);
  if (storageUploadCount) state.uploadCount = JSON.parse(storageUploadCount);
};
init();

/***************************** Transitions ********************************/
const homeDOM = document.getElementById('home');
const appDOM = document.getElementById('app');
const pageDashboardDOM = document.getElementById('pageDashboard');
const pageRecipeDOM = document.getElementById('pageRecipe');
const heroDOM = document.getElementById('hero');

export const transitionToDash = () => {
  homeDOM.style.height = '100%';
  heroDOM.classList.add('hero-transition-out');
  appDOM.classList.add('app-transition-in');
  pageDashboardDOM.classList.add('page-transition-in');

  //to fix the error for modal
  pageDashboardDOM.classList.add('pageDash-minHeight');
};

export const transitionToRecipe = () => {
  pageDashboardDOM.classList.remove('page-transition-in');
  pageRecipeDOM.classList.add('page-transition-in');
  pageRecipeDOM.classList.add('page-transition-in-margin');

  //to fix the error for modal
  pageDashboardDOM.classList.remove('pageDash-minHeight');

  //scroll
  scrollIntoPosition('top');
};

export const transitionBackToDash = () => {
  if (!uploadedARecipe) {
    pageDashboardDOM.classList.add('page-transition-in');
    pageRecipeDOM.classList.remove('page-transition-in');
    pageRecipeDOM.classList.remove('page-transition-in-margin');
    removeHashURL();

    //to fix the error for modal
    pageDashboardDOM.classList.add('pageDash-minHeight');
  }

  //fix error from Recipe Upload
  if (uploadedARecipe) {
    location.reload();
  }
};

/***************************** Upload Recipe ********************************/

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: state.username, //newRecipe.publisher
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(
      `${API_URL}?search=${recipe.title}&key=${API_KEY}`,
      recipe
    );
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const API_KEY = '1a50569f-d47f-4626-ab5b-54a81f3df488';
export const TIMEOUT_SEC = 10;
export const MODAL_CLOSE_SEC = 3;
export const TRANSITION_SEC = 3;
export const UPLOAD_LIMIT = 2; // 3 uploads
export const CHAR_USER_MIN = 4;

const resultsPerPage = () => {
  let RES_PER_PAGE = 12;
  const landMediaQuery = window.matchMedia('(max-width: 1200px)');
  const phoneMediaQuery = window.matchMedia('(max-width: 600px)');

  if (landMediaQuery.matches) {
    RES_PER_PAGE = 10;
    return RES_PER_PAGE;
  }

  if (phoneMediaQuery.matches) {
    RES_PER_PAGE = 8;
    return RES_PER_PAGE;
  } else {
    return RES_PER_PAGE;
  }
};

export const RES_PER_PAGE = resultsPerPage();

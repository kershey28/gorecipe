import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const scrollIntoPosition = position => {
  let coord;
  const phoneMediaQuery = window.matchMedia('(max-width: 600px)');

  if (position === 'results' && !phoneMediaQuery.matches) coord = 1700;
  if (position === 'results' && phoneMediaQuery.matches) coord = 2800;
  if (position === 'form-user') coord = 650;
  if (position === 'top') coord = 0;

  window.scrollTo({
    top: coord,
    behavior: 'smooth',
  });
};

export const removeHashURL = () => {
  window.location.hash = '';
};

// Intersection Observer
export const animateCard = (entries, observer) => {
  const [entry] = entries;
  const animateStart = () =>
    entry.target.children[0].classList.add('card-float__animation');

  const animateEnd = () =>
    entry.target.children[0].classList.remove('card-float__animation');

  if (!entry.isIntersecting) return;

  animateStart();

  // Reset
  observer.unobserve(entry.target);
  setTimeout(animateEnd, 3000);
};

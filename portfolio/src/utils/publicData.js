const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CACHE_TTL = 30_000;
const cache = new Map();

function load(key, path) {
  const current = cache.get(key);
  if (current && current.expiresAt > Date.now()) return current.promise;

  const promise = fetch(`${API_BASE}${path}`)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error(`${key} unavailable`)))
    .then((data) => {
      cache.set(key, { promise: Promise.resolve(data), expiresAt: Date.now() + CACHE_TTL });
      return data;
    })
    .catch((error) => {
      cache.delete(key);
      throw error;
    });

  cache.set(key, { promise, expiresAt: Date.now() + CACHE_TTL });
  return promise;
}

export function loadProjects(query = '') {
  return load(`projects:${query}`, `/projects${query}`);
}

export function loadReviews() {
  return load('reviews', '/reviews');
}

export function clearPublicDataCache() {
  cache.clear();
}
/* global axios */

export function goTo(url) {
  window.location.href = url;
}

export const api = () => {
  const instance = axios.create({
    baseURL: `${location.protocol}//localhost:8080/`,
  });

  return instance;
};

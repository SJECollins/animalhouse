function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getAccessTokenCookie() {
  const accessToken = getCookie("access_token");
  return accessToken;
}

function setAccessTokenCookie(accessToken) {
  setCookie("access_token", accessToken, 1);
}

function removeAccessTokenCookie() {
  removeCookie("access_token");
}

function setRefreshTokenCookie(refreshToken) {
  setCookie("refresh_token", refreshToken, 30);
}

function getRefreshTokenCookie() {
  const refreshToken = getCookie("refresh_token");
  return refreshToken;
}

function removeRefreshTokenCookie() {
  removeCookie("refresh_token");
}

export {
  setCookie,
  getAccessTokenCookie,
  setAccessTokenCookie,
  removeAccessTokenCookie,
  setRefreshTokenCookie,
  getRefreshTokenCookie,
  removeRefreshTokenCookie,
};

/* global axios */

export function verificaEmail(email) {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email.value)) {
    email.setCustomValidity("Formato não aceito.");
  } else {
    email.setCustomValidity("");
  }
}

export function verificaSenha(password, confirmPassword) {
  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Senhas não se coincidem.");
  } else {
    confirmPassword.setCustomValidity("");
  }
}

export function verificaData(data) {
  const hoje = new Date();

  if (new Date(data.value) > hoje) {
    data.setCustomValidity("Data não aceita.");
  } else {
    data.setCustomValidity("");
  }
}

export function getParameters() {
  const paramsRet = {};
  const url = window.location.href;
  const paramsStart = url.indexOf("?");

  if (paramsStart !== -1) {
    const paramString = decodeURIComponent(url.substring(paramsStart + 1));
    const params = paramString.split("&");
    for (const element of params) {
      const pairArray = element.split("=");
      if (pairArray.length === 2) {
        paramsRet[pairArray[0]] = pairArray[1];
      }
    }
    return paramsRet;
  }
  return null;
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem("token"));
}

export function goTo(url) {
  window.location.href = url;
}

export const signOut = (userInfo, axios) => {
  const requisicao = axios.post("https://localhost:8080/sign-out", null, {
    headers: { Authorization: `Bearer ${userInfo.token}`, "User-Type": userInfo.userType },
  });
  requisicao
    .then(() => {
      goTo("index.html");
    })
    .catch((e) => {
      const errorMsg = e.response.data.error ? e.response.data.error : e;
      const msg = `Algo deu errado, tente novamente\n${errorMsg}`;
      alert(msg);
      if (e.response && e.response.status === 401) {
        goTo("index.html");
      }
    })
    .finally(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("beforeLoginRoute");
    });
};

export const verifyLogin = () => {
  const userInfo = getUserInfo();

  if (!userInfo) {
    let beforeLoginRoute = window.location.pathname;
    if (window.location.search) beforeLoginRoute += window.location.search;
    localStorage.setItem("beforeLoginRoute", beforeLoginRoute);
    goTo("login.html");
  }

  return userInfo;
};

export const api = () => {
  const instance = axios.create({
    baseURL: `${location.protocol}//localhost:8080/`,
  });

  return instance;
};

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
  const requisicao = axios.post("http://localhost:8080/sign-out", null, {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  });
  requisicao
    .then(() => {
      localStorage.removeItem("token");
      location.reload();
    })
    .catch((e) => {
      const errorMsg = e.response.data.error ? e.response.data.error : e;
      const msg = `Algo deu errado, tente novamente\n${errorMsg}`;
      // eslint-disable-next-line no-alert
      alert(msg);
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("token");
        location.reload();
      }
    });
};

export const verifyLogin = () => {
  const userInfo = getUserInfo();

  if (!userInfo) {
    const beforeLoginRoute = window.location.pathname;
    localStorage.setItem("beforeLoginRoute", beforeLoginRoute);
    goTo("login.html");
  }

  return userInfo;
};

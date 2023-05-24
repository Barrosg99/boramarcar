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

export function goTo(url) {
  window.location.href = url;
}

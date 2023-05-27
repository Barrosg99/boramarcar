/* global axios */
import * as utils from "./utils.js";

const userInfo = utils.getUserInfo();

const form = document.querySelector("form.form-cadastro");

form.onsubmit = function () {
  const submitButton = document.getElementById("btn-pessoal");
  const formData = new FormData(form);
  const body = Object.fromEntries(formData);
  body.publico = body.publico === "true";

  submitButton.disabled = true;
  const requisicao = axios.post("http://localhost:8080/eventos", body, {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  });
  requisicao
    .then(() => {
      utils.goTo("index.html");
    })
    .catch((e) => {
      const errorMsg = e.response ? e.response.data.error : e;
      const errorDiv = document.querySelector(".error-container");
      errorDiv.innerText = `Algo deu errado, tente novamente\n${errorMsg}`;
    })
    .finally(() => {
      submitButton.disabled = false;
    });

  return false;
};

/* global axios */
import * as utils from "./utils.js";

const data = document.getElementById("input-nascimento");

function verificaData() {
  const hoje = new Date();

  if (new Date(data.value) > hoje) {
    data.setCustomValidity("Data não aceita.");
  } else {
    data.setCustomValidity("");
  }
}

data.onchange = verificaData;

const params = utils.getParameters();
const form = document.querySelector("form.form-cadastro");

if (form && params) {
  const urlParams = Object.entries(params);
  for (const [key, value] of urlParams) {
    const input = document.createElement("input");
    input.setAttribute("name", key);
    input.hidden = true;
    input.setAttribute("value", value);
    form.appendChild(input);
  }
}

form.onsubmit = function () {
  const submitButton = document.getElementById("btn-pessoal");
  const formData = new FormData(form);
  submitButton.disabled = true;
  const requisicao = axios.post("http://localhost:8080/pessoas", Object.fromEntries(formData));
  requisicao
    .then(() => {
      utils.goTo("login.html");
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

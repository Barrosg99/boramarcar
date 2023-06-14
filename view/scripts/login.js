import * as utils from "./utils.js";

const api = utils.api();

const form = document.querySelector("form.form-cadastro");

form.onsubmit = function () {
  const submitButton = document.getElementById("btn-pessoal");
  const formData = new FormData(form);
  submitButton.disabled = true;
  const requisicao = api.post("/login", Object.fromEntries(formData));
  requisicao
    .then((res) => {
      localStorage.setItem("token", JSON.stringify(res.data));
      const beforeLoginRoute = localStorage.getItem("beforeLoginRoute");
      if (beforeLoginRoute) utils.goTo(beforeLoginRoute);
      else utils.goTo("index.html");
    })
    .catch((e) => {
      const errorMsg = e.response ? e.response.data.error || e.message : e;
      const errorDiv = document.querySelector(".error-container");
      errorDiv.innerText = `Algo deu errado, tente novamente\n${errorMsg}`;
    })
    .finally(() => {
      submitButton.disabled = false;
    });

  return false;
};

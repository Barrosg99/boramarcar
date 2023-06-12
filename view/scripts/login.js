/* global axios */
import * as utils from "./utils.js";

const form = document.querySelector("form.form-cadastro");

form.onsubmit = function () {
  const submitButton = document.getElementById("btn-pessoal");
  const formData = new FormData(form);
  submitButton.disabled = true;
  const requisicao = axios.post("http://localhost:8080/login", Object.fromEntries(formData));
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
      if (e.response && e.response.status === 401) {
        errorDiv.innerText = "Algo deu errado, tente novamente\nLogue novamente";
        localStorage.removeItem("token");
      }
    })
    .finally(() => {
      submitButton.disabled = false;
    });

  return false;
};
// const xhr = new XMLHttpRequest();
// const formData = new FormData(form);
// // open the request
// xhr.open("POST", "http://localhost:8080/login");
// xhr.setRequestHeader("Content-Type", "application/json");

// // send the form data
// xhr.send(JSON.stringify(Object.fromEntries(formData)));

// xhr.onreadystatechange = function (req) {
//   if (xhr.readyState === XMLHttpRequest.DONE) {
//     window.location.href = "index.html";
//     localStorage.setItem("token", req.currentTarget.response);
//   }
// };
// // Fail the onsubmit to avoid page refresh.
// return false;

/* global axios */
import * as utils from "./utils.js";

const userInfo = utils.getUserInfo();

const fileInput = document.getElementById("file-upload");
const label = document.querySelector("label.custom-file-upload");

fileInput.onchange = () => {
  if (fileInput.files.length) {
    let formatedFileName;
    const fileName = fileInput.files[0].name;
    if (fileName.length > 16) {
      formatedFileName = fileName.substring(0, 14);
      formatedFileName += "...";
    }
    label.children[0].innerText = formatedFileName || fileName;
    label.style.color = "#004aad";
    label.style.fontWeight = "normal";
  } else {
    label.innerText = "Upload da Imagem";
    label.style.color = "white";
    label.style.fontWeight = "bold";
    label.setCustomValidity("A imagem é obrigatória");
  }
};

const form = document.querySelector("form.form-cadastro");

form.onsubmit = function () {
  const submitButton = document.getElementById("btn-pessoal");
  const formData = new FormData(form);
  formData.append("file", fileInput.files[0]);
  const body = Object.fromEntries(formData);
  body.publico = body.publico === "true";

  submitButton.disabled = true;
  const requisicao = axios.post("http://localhost:8080/eventos", body, {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      "Content-Type": "multipart/form-data",
    },
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

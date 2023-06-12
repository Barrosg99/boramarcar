import * as utils from "./utils.js";

const userInfo = utils.verifyLogin();
const api = utils.api();

const dateInput = document.getElementById("input-data-evento");
const fileInput = document.getElementById("file-upload");
const label = document.querySelector("label.custom-file-upload");
const form = document.querySelector("form.form-cadastro");
const enderecoInputs = document.querySelectorAll(".endereco");

if (userInfo.userType === "estabelecimento") {
  dateInput.style.width = "100%";
  for (const endereco of enderecoInputs) {
    endereco.remove();
  }
}

dateInput.onblur = () => {
  dateInput.type = "text";
};

dateInput.onfocus = () => {
  const [datetime, min] = new Date().toISOString().split(":");

  dateInput.min = [datetime, min].join(":");
  dateInput.type = "datetime-local";
};

dateInput.onchange = () => {
  const hoje = new Date();

  if (new Date(dateInput.value) < hoje) {
    dateInput.setCustomValidity("Data não aceita.");
  } else {
    dateInput.setCustomValidity("");
  }
};

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
  }
};

form.onsubmit = function () {
  const submitButton = document.getElementById("btn-pessoal");
  const formData = new FormData(form);
  formData.append("file", fileInput.files[0]);
  const body = Object.fromEntries(formData);
  body.publico = body.publico === "true";
  submitButton.disabled = true;

  api
    .post("/eventos", body, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "multipart/form-data",
        "User-Type": userInfo.userType,
      },
    })
    .then(() => {
      utils.goTo("index.html");
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

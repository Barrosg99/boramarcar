import * as utils from "./utils.js";

const api = utils.api();

const data = document.getElementById("input-nascimento");

if (data) data.onchange = () => utils.verificaData(data);

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

const fileInput = document.getElementById("file-upload");

fileInput.onchange = () => {
  const image = document.getElementById("avatar");
  if (fileInput.files.length) {
    image.src = URL.createObjectURL(fileInput.files[0]);
    image.style.display = "inherit";
  } else {
    image.style.display = "none";
  }
};

form.onsubmit = function () {
  const submitButton = document.getElementById("btn-pessoal");
  const formData = new FormData(form);
  formData.append("file", fileInput.files[0]);
  const body = Object.fromEntries(formData);
  submitButton.disabled = true;
  const route = location.pathname === "/cadastro-estabelecimento.html" ? "/estabelecimento" : "/pessoas";

  const requisicao = api.post(route, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

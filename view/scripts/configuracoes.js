/* global axios */
import * as utils from "./utils.js";

const userInfo = utils.verifyLogin();

let avatar;
const img = document.querySelector("form img");
const allInputs = document.querySelectorAll(".form-cadastro input");

const requisicao = axios.get("http://localhost:8080/pessoas/eu", {
  headers: {
    Authorization: `Bearer ${userInfo.token}`,
    "Content-Type": "multipart/form-data",
  },
});

requisicao
  .then((res) => {
    const { data } = res;

    avatar = `http://localhost:8080/imagens/${data.fk_Imagem_id}`;
    img.src = avatar;

    for (const input of allInputs) {
      if (!input.name) continue;
      if (input.name === "senha") continue;
      if (input.name === "data_nascimento") {
        input.value = data[input.name].split("T")[0];
        continue;
      }
      input.value = data[input.name];
    }
  })
  .catch((res) => {
    console.log(res);
  });

const fileInput = document.getElementById("file-upload");

fileInput.onchange = () => {
  if (fileInput.files.length) {
    img.src = URL.createObjectURL(fileInput.files[0]);
  } else {
    img.src = avatar;
  }
};

const editButton = document.getElementById("editar");
const fileLabel = document.querySelector("label");
editButton.onclick = () => {
  if (fileLabel.style.display === "none") fileLabel.style.display = "inherit";
  else fileLabel.style.display = "none";
  for (const input of allInputs) {
    input.disabled = !input.disabled;
  }
};

import * as utils from "./utils.js";

const userInfo = utils.verifyLogin();
const api = utils.api();

const senha = document.getElementById("input-senha");
const confirmacaoSenha = document.getElementById("input-confirma-senha");
const email = document.getElementById("input-email");
const data = document.getElementById("input-nascimento");

senha.onchange = () => utils.verificaSenha(senha, confirmacaoSenha);
confirmacaoSenha.onkeyup = () => utils.verificaSenha(senha, confirmacaoSenha);
email.onchange = () => utils.verificaEmail(email);
data.onchange = () => utils.verificaData(data);

let avatar;
const img = document.querySelector("form img");
const allInputs = document.querySelectorAll("form input");

const toggleAllInputs = () => {
  for (const input of allInputs) {
    input.disabled = !input.disabled;
  }
};

try {
  const { data: dadosUsuario } = await api.get("/pessoas/eu", {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  avatar = `http://localhost:8080/imagens/${dadosUsuario.fk_Imagem_id}`;
  img.src = avatar;

  for (const input of allInputs) {
    if (!input.name) continue;
    if (input.name === "file") continue;
    if (input.name === "senha") continue;
    if (input.name === "data_nascimento") {
      input.value = dadosUsuario[input.name].split("T")[0];
      continue;
    }
    input.value = dadosUsuario[input.name];
  }
} catch (e) {
  let errorMsg = e.response ? e.response.data.error || e.message : e;
  if (e.response && e.response.status === 401) {
    errorMsg = "Algo deu errado\nLogue novamente";
    localStorage.removeItem("token");
  }
  alert(errorMsg);
}

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
const form = document.querySelector("form");

form.onsubmit = function () {
  try {
    const formData = new FormData(form);
    if (fileInput.files[0]) formData.append("file", fileInput.files[0]);
    const body = Object.fromEntries(formData);
    if (!body.file.size) delete body.file;
    if (!body.senha?.length) delete body.senha;
    api
      .get("/pessoas/eu", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((res) => {
        alert(res);
      })
      .finally(() => {
        fileLabel.style.display = "none";
        editButton.innerText = "Editar perfil";
        editButton.className = "btn btn-primary";
        editButton.type = "button";
        toggleAllInputs();
      });

    console.log(body);
  } catch (error) {
    console.log(error);
  }
  return false;
  // editButton.disabled = true;
};

editButton.onclick = () => {
  if (fileLabel.style.display === "none") {
    fileLabel.style.display = "inherit";
    editButton.innerText = "Salvar mudanças";
    editButton.className = "btn btn-success";
    setTimeout(() => {
      editButton.type = "submit";
    }, 1);
    toggleAllInputs();
  } else {
    // fileLabel.style.display = "none";
    // editButton.innerText = "Editar perfil";
    // editButton.className = "btn btn-primary";
    // editButton.type = "submit";
  }
};

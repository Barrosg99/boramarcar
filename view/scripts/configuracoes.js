import * as utils from "./utils.js";

const userInfo = utils.verifyLogin();
const { userType } = userInfo;
const route = userType === "estabelecimento" ? "/estabelecimento/eu" : "/pessoas/eu";

const api = utils.api();

const senha = document.getElementById("input-senha");
const confirmacaoSenha = document.getElementById("input-confirma-senha");
const email = document.getElementById("input-email");
const data = document.getElementById("input-nascimento");

const editButton = document.getElementById("editar");
const excluirButton = document.getElementById("excluir");
const fileLabel = document.querySelector("label");
const form = document.querySelector("form");

senha.onchange = () => utils.verificaSenha(senha, confirmacaoSenha);
confirmacaoSenha.onkeyup = () => utils.verificaSenha(senha, confirmacaoSenha);
email.onchange = () => utils.verificaEmail(email);
data.onchange = () => utils.verificaData(data);

if (userInfo.userType === "estabelecimento") {
  const cpfCnpjDiv = document.querySelector(".cpf-or-cnpj");

  // prettier-ignore
  cpfCnpjDiv.innerHTML = "<input minlength='18' disabled type='text' class='form-control' style='width: 100%;' name='cnpj' data-mask='00.000.000/0000-00' autocomplete='off' id='input-cpf-cnpj' placeholder='CNPJ:' required>";

  const dataTipoDiv = document.querySelector(".data-or-tipo");

  // prettier-ignore
  dataTipoDiv.innerHTML = "<select disabled class='form-select same-line-input' id='tipo' name='tipo' required><option value='' selected hidden>Tipo</option><option value='restaurante'>Restaurante</option><option value='bar'>Bar</option>        <option value='casaDeFestas'>Casa de Festas</option><option value='karaoke'>Karaokê</option><option value='buffet'>Buffet</option><option value='shopping'>Shopping</option></select><input type='text' minlength='15' class=' form-control cel-sp-mask same-line-input' id='input-telefone' name='telefone' aria-describedby='nomeHelp' placeholder='Telefone:' style='width: 49%' disabled required></input>";

  editButton.innerText = "Editar\n estabelecimento";
  excluirButton.innerText = "Excluir\n estabelecimento";
}

let avatar;
const img = document.querySelector("form img");
const allInputs = document.querySelectorAll("form input");

const toggleAllInputs = () => {
  const select = document.getElementById("tipo");
  if (select) select.disabled = !select.disabled;
  for (const input of allInputs) {
    input.disabled = !input.disabled;
  }
};

try {
  const { userType } = userInfo;
  const route = userType === "estabelecimento" ? "/estabelecimento/eu" : "/pessoas/eu";

  const { data: dadosUsuario } = await api.get(route, {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
      "Content-Type": "multipart/form-data",
      "User-Type": userType,
    },
  });

  avatar = `${location.protocol}//localhost:8080/imagens/${dadosUsuario.imagemId}`;
  img.src = avatar;

  const select = document.getElementById("tipo");
  if (select) select.value = dadosUsuario.tipo;

  for (const input of allInputs) {
    if (!input.name) continue;
    if (input.name === "file") continue;
    if (input.name === "senha") continue;
    if (input.name === "dataNascimento") {
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
    location.reload();
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

form.onsubmit = function () {
  const formData = new FormData(form);
  if (fileInput.files[0]) formData.append("file", fileInput.files[0]);
  const body = Object.fromEntries(formData);
  if (!body.file.size) delete body.file;
  if (!body.senha?.length) delete body.senha;

  api
    .put(route, body, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "multipart/form-data",
        "User-Type": userType,
      },
    })
    .then(() => {
      alert("Dados atualizados");
      location.reload();
    })
    .catch((e) => {
      let errorMsg = e.response ? e.response.data.error || e.message : e;
      if (e.response && e.response.status === 401) {
        errorMsg = "Algo deu errado, tente novamente\nLogue novamente";
        localStorage.removeItem("token");
      }
      alert(errorMsg);
    })
    .finally(() => {
      fileLabel.style.display = "none";
      editButton.innerText = "Editar perfil";
      editButton.className = "btn btn-primary";
      editButton.type = "button";
      toggleAllInputs();
    });
  return false;
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
  }
};

excluirButton.onclick = () => {
  const excluir = confirm("Deseja excluir sua conta ?\nIsso apagará todos os seus eventos criados.");
  if (excluir) {
    api
      .delete(route, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "multipart/form-data",
          "User-Type": userInfo.userType,
        },
      })
      .then(() => {
        utils.goTo("index.html");
        localStorage.removeItem("token");
      })
      .catch((e) => {
        let errorMsg = e.response ? e.response.data.error || e.message : e;
        if (e.response && e.response.status === 401) {
          errorMsg = "Algo deu errado, tente novamente\nLogue novamente";
          localStorage.removeItem("token");
          location.reload();
        }
        alert(errorMsg);
      });
  }
};

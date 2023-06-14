import * as utils from "./utils.js";

const userInfo = utils.verifyLogin();
const params = new URLSearchParams(location.search);
const entries = params.entries();
const filter = Object.fromEntries(entries);

const editButton = document.getElementById("editar");
const excluirButton = document.getElementById("excluir");
const fileLabel = document.querySelector("label");
const form = document.querySelector("form");
const info = document.querySelector(".form-cadastro");

let evento;
let presente;

if (!filter.idEvento) utils.goTo("index.html");

const route = `/eventos/${filter.idEvento}`;

const api = utils.api();

const dateInput = document.getElementById("input-data-evento");

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

const toggleMarcar = (marcarButton) => {
  if (presente) {
    marcarButton.innerText = "Desmarcar? :(";
    marcarButton.className = "btn btn-danger";
  } else {
    marcarButton.innerText = "bora marcar";
    marcarButton.className = "btn btn-success";
  }
};

const pegarPessoasConfirmadas = async () => {
  const { data: pessoasPresentes } = await api.get(`${route}/presentes`, {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
      "User-Type": userInfo?.userType,
    },
  });
  info.style.display = "flex";
  info.style.flexWrap = "wrap";
  info.style.width = "60%";

  if (!pessoasPresentes.length) {
    const div = document.createElement("div");
    // prettier-ignore

    div.innerHTML = "<p style=\"color: #004AAD;font-weight: bold;margin-top: 25px;margin-bottom: 25px;text-align: center;font-size: 20px;\">Ninguem confirmou presença ainda, seja o primeiro !!!</p>";
    info.appendChild(div);
  }

  for (const pessoa of pessoasPresentes) {
    const div = document.createElement("div");
    div.style.margin = "10px";
    div.innerHTML = `<img src="${location.protocol}//localhost:8080/imagens/${pessoa.imagemId}" class="img-fluid" style="width: 100px; height: 100px; border-radius:100%"><p style="width: 110px;text-overflow: ellipsis;overflow: hidden;text-wrap: nowrap;">${pessoa.nome}</p>`;
    info.appendChild(div);
  }
};

const marcar = (marcarButton, verConfirmadas) => {
  api
    .post(
      "eventos/marcar",
      { comparece: false, eventoId: evento.id },
      {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          "Content-Type": "application/json",
          "User-Type": userInfo?.userType,
        },
      },
    )
    .then((res) => {
      presente = res.data.presente;
      toggleMarcar(marcarButton);
      if (verConfirmadas) verConfirmadas();
    })
    .catch((e) => {
      let errorMsg = e.response ? e.response.data.error || e.message : e;
      if (e.response && e.response.status === 401) {
        errorMsg = "Algo deu errado\nLogue novamente";
        localStorage.removeItem("token");
        location.reload();
      }
      alert(errorMsg);
    });
};

const montaEventos = () => {
  const h2 = document.querySelector("h2");
  h2.innerText = evento.nome;

  const div = document.querySelector(".botoes");
  div.innerHTML = "";
  div.style = "font-size: 20px;width: 315px;color: #004AAD;";
  div.innerText = evento.descricao;

  info.innerHTML = "";
  info.style = "padding-top: 0px;padding-bottom: 30px;margin: 0px 24px;";
  form.style.marginTop = "30px";
  const [data, horario] = evento.horario.split("T");
  const [horas, min] = horario.split(":");
  const tipo = evento.publico === 1 ? "Público" : "Privado";

  const p = document.createElement("p");
  p.style = "font-size: 20px;color: #004AAD;";
  p.innerText = `${evento.logradouro}, ${evento.municipio} - ${evento.estado}\nComplemento: ${evento.complemento}\nCEP: ${
    evento.cep
  }\n\nData: ${data.replaceAll("-", "/")} \nHorario: ${[horas, min].join(":")}\nTipo: ${tipo}\nCriado por:`;
  info.appendChild(p);

  const criadorEvento = document.createElement("div");
  criadorEvento.style = "display: flex;align-items: center;justify-content: space-between;width: 70%;flex-wrap:wrap;margin-bottom: 20px;";
  criadorEvento.innerHTML = ` <img src="${location.protocol}//localhost:8080/imagens/${evento.imagemUsuario}" class="img-fluid" style="width: 100px; height: 100px; border-radius:100%"><p style="font-size: 20px;color: #004AAD;" >${evento.nomeUsuario}</p>
    `;
  info.appendChild(criadorEvento);
};

const verConfirmadas = () => {
  info.innerHTML = "";
  pegarPessoasConfirmadas().then(() => {
    const divBotoes = document.createElement("div");
    if (userInfo.userType !== "estabelecimento") {
      divBotoes.style = "display: flex;align-items: center;justify-content: space-between;width: 100%;flex-wrap:wrap;";
      divBotoes.innerHTML = `<button id="marcar" class="btn btn-success" type="button" style="max-width: 315px; margin-bottom: 25px;">bora marcar
</button><button id="eventosInfo" class="btn btn-primary" type="button" style="max-width: 315px; margin-bottom: 25px;">Ver informações do evento
</button>`;
      info.appendChild(divBotoes);
      const marcarButton = document.getElementById("marcar");
      toggleMarcar(marcarButton);
      marcarButton.onclick = () => marcar(marcarButton, verConfirmadas);
      const eventosInfo = document.getElementById("eventosInfo");

      eventosInfo.onclick = () => {
        montaEventos();
        const divBotoes = document.createElement("div");
        if (userInfo.userType !== "estabelecimento") {
          divBotoes.style = "display: flex;align-items: center;justify-content: space-between;width: 100%;flex-wrap:wrap;";
          divBotoes.innerHTML = `<button id="marcar" class="btn btn-success" type="button" style="max-width: 315px; margin-bottom: 25px;">bora marcar
</button><button id="pessoasConfirmadas" class="btn btn-primary" type="button" style="max-width: 315px; margin-bottom: 25px;">Ver pessoas confirmadas
</button>`;
          info.appendChild(divBotoes);
          const marcarButton = document.getElementById("marcar");
          const confirmadasButton = document.getElementById("pessoasConfirmadas");
          marcarButton.onclick = () => marcar(marcarButton);
          confirmadasButton.onclick = verConfirmadas;
          toggleMarcar(marcarButton);
        }
      };
    }
  });
};

const eventoInfo = () => {
  montaEventos();
  const divBotoes = document.createElement("div");
  if (userInfo.userType !== "estabelecimento") {
    divBotoes.style = "display: flex;align-items: center;justify-content: space-between;width: 100%;flex-wrap:wrap;";
    divBotoes.innerHTML = `<button id="marcar" class="btn btn-success" type="button" style="max-width: 315px; margin-bottom: 25px;">bora marcar
</button><button id="pessoasConfirmadas" class="btn btn-primary" type="button" style="max-width: 315px; margin-bottom: 25px;">Ver pessoas confirmadas
</button>`;
    info.appendChild(divBotoes);
    const marcarButton = document.getElementById("marcar");
    const confirmadasButton = document.getElementById("pessoasConfirmadas");
    marcarButton.onclick = () => marcar(marcarButton);
    confirmadasButton.onclick = verConfirmadas;
    toggleMarcar(marcarButton);
  }
};

if (userInfo) {
  try {
    const { data: eventoApi } = await api.get(route, {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`,
        "User-Type": userInfo?.userType,
      },
    });
    evento = eventoApi;
    presente = evento.presente;
    avatar = `${location.protocol}//localhost:8080/imagens/${evento.imagemId}`;
    img.src = avatar;
    if (evento.meuEvento) {
      const select = document.getElementById("tipo");
      if (select) select.value = evento.publico ? "true" : "false";

      for (const input of allInputs) {
        if (!input.name) continue;
        if (input.name === "file") continue;
        if (input.name === "senha") continue;
        if (input.name === "horario") {
          const [datetime, min] = evento[input.name].split(":");
          input.value = [datetime, min].join(":");
          continue;
        }
        input.value = evento[input.name];
      }
    } else {
      eventoInfo();
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
  body.removeImageId = evento.imagemId;
  api
    .put(route, body, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "multipart/form-data",
        "User-Type": userInfo.userType,
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

if (editButton) {
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
}

if (excluirButton) {
  excluirButton.onclick = () => {
    const excluir = confirm("Deseja excluir sua conta ?\nIsso apagará todos os seus eventos criados.");
    if (excluir) {
      api
        .delete(route, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "User-Type": userInfo.userType,
          },
        })
        .then(() => {
          utils.goTo("index.html");
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
}

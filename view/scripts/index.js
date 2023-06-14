import * as utils from "./utils.js";

const api = utils.api();
const userInfo = utils.getUserInfo();

const params = new URLSearchParams(location.search);
const entries = params.entries();
const filter = Object.fromEntries(entries);

if (userInfo) {
  const h2 = document.querySelector(".h2");
  if (h2) h2.remove();
  const titleContainer = document.querySelector(".title-container");
  titleContainer.className = "d-flex justify-content-around title-container";
  titleContainer.innerHTML = `<h1 style="color: #004aad;font-weight: bold;">Navegue pelos eventos:</h1>
    <div class="dropdown">
      <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"
        data-bs-auto-close="outside">
        Filtros
      </button>
      <form class="dropdown-menu p-4">
        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="eventosMarcados" value="true" id="flexRadioDefault1">
            <label class="form-check-label" for="flexRadioDefault1">
              Marcados!
            </label>
          </div>
        </div>
        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="eventosMarcados" value="false" id="flexRadioDefault2"
              checked>
            <label class="form-check-label" for="flexRadioDefault2">
              Bora marcar?
            </label>
          </div>
        </div>
        <div class="mb-3">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="eventosMarcados" value="" id="flexRadioDefault3" checked>
            <label class="form-check-label" for="flexRadioDefault3">
              Todos
            </label>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Procurar</button>
      </form>
    </div>`;
}

const listaEventos = (container, evento) => {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = `http://localhost:8080/imagens/${evento.imagemId}`;
  img.className = "card-img-top";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.innerText = evento.nome;

  const subTitle = document.createElement("p");
  subTitle.className = "card-text";
  subTitle.innerText = evento.descricao;

  const link = document.createElement("a");
  link.href = "#";
  link.className = "btn btn-primary";
  link.innerText = "bora marcar";

  cardBody.appendChild(title);
  cardBody.appendChild(subTitle);
  cardBody.appendChild(link);
  card.appendChild(img);
  card.appendChild(cardBody);
  container.appendChild(card);
};

const listaEventosAutenticados = (container, evento) => {
  const div = document.createElement("div");
  div.className = "card mb-3";
  div.style = "min-width: 70%; margin-left: 0; margin-right: 0;";

  const textButton = filter?.meusEventos === "true" ? "Editar Evento" : evento.presente ? "Desmarcar ? :(" : "bora marcar";
  // prettier-ignore
  div.innerHTML = `
      <div class="row g-0" style="min-height: 153px;">
        <div style="flex: 0 0 auto;width: 66.66666667%">
          <div class="card-body" style="height: 100%;">
            <h5 class="card-title" style="color: blue; font-weight: bold;">${evento.nome}</h5>
            <p class="card-text" style="color: blue;margin-bottom: 0;-webkit-line-clamp: 2;">${evento.descricao}</p>
            <a href="evento.html?idEvento=${evento.id}" style="right: unset;" class="btn ${evento.presente ? "btn-danger" : "btn-primary"}">${textButton}</a>
          </div>
        </div>
        <div style="flex: 0 0 auto;width: 33.33333333%;">
          <img src="http://localhost:8080/imagens/${evento.imagemId}" style="height: 100%;" class="img-fluid rounded-start" alt="...">
        </div>
      </div>
    `;
  container.appendChild(div);
  container.appendChild(div);
  container.appendChild(div);
  container.appendChild(div);
};

try {
  const { data: eventos } = await api.get("/eventos", {
    params: { ...filter, id: userInfo?.id },
  });

  const container = document.querySelector("#lista-eventos");
  container.innerHTML = "";
  if (!eventos.length) {
    container.style.justifyContent = "center";
    const h1 = document.createElement("h1");
    h1.className = "h1";
    h1.innerText = "Não há eventos no momento :(\nCrie o seu !!!";
    container.appendChild(h1);
  } else {
    for (const evento of eventos) {
      if (userInfo) {
        container.className = "d-flex flex-column align-items-center";
        listaEventosAutenticados(container, evento);
      } else {
        listaEventos(container, evento);
      }
    }
  }
} catch (e) {
  const errorMsg = e.response ? e.response.data.error || e.message : e;
  const msg = `Algo deu errado, tente novamente\n${errorMsg}`;
  alert(msg);
}

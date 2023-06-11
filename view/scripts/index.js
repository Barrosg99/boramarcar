import * as utils from "./utils.js";

const api = utils.api();

try {
  const { data: eventos } = await api.get("/eventos");

  const container = document.querySelector("#lista-eventos");
  container.innerHTML = "";
  if (!eventos.length) {
    const h1 = document.createElement("h1");
    h1.className = "h1";
    h1.innerText = "Não há eventos no momento :(\nCrie o seu !!!";
    container.appendChild(h1);
  }
  for (const evento of eventos) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = `http://localhost:8080/imagens/${evento.fk_Imagem_Id}`;
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
  }
} catch (e) {
  const errorMsg = e.response ? e.response.data.error || e.message : e;
  const msg = `Algo deu errado, tente novamente\n${errorMsg}`;
  alert(msg);
}

import * as utils from "./utils.js";

const api = utils.api();
const token = utils.getToken();

const params = new URLSearchParams(location.search);
const entries = params.entries();
const filter = Object.fromEntries(entries);
const { tabela } = filter;

const main = document.getElementById("root");

const homeAutenticada = () => {
  main.innerHTML = `<h1 style="color: white;">ADMIN BORA MARCAR</h1>
    <div class="list-group" style="margin-top: 30px;">
      <a href="index.html?tabela=pessoa" class="list-group-item list-group-item-action ">Pessoa</a>
      <a href="index.html?tabela=estabelecimento" class="list-group-item list-group-item-action">Estabelecimento</a>
      <a href="index.html?tabela=evento" class="list-group-item list-group-item-action">Evento</a>
    </div>`;
};

if (!tabela) {
  if (token) homeAutenticada();
  else {
    const form = document.querySelector("form");

    form.onsubmit = () => {
      const submitButton = document.querySelector("form button");
      const formData = new FormData(form);
      submitButton.disabled = true;
      const requisicao = api.post("/admin", Object.fromEntries(formData));
      requisicao
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data));
          homeAutenticada();
        })
        .catch((e) => {
          const errorMsg = e.response ? e.response.data.error || e.message : e;
          alert(`${errorMsg}`);
        })
        .finally(() => {
          submitButton.disabled = false;
        });

      return false;
    };
  }
}

/* global axios */
import * as utils from "./utils.js";

const userInfo = utils.getUserInfo();

if (userInfo) {
  const userHeader = document.querySelector("#navbarSupportedContent");

  userHeader.innerHTML = "";
  userHeader.className = "btn-group";
  const button = document.createElement("button");
  button.className = "btn btn-danger dropdown-toggle";
  button.setAttribute("data-bs-toggle", "dropdown");
  button.setAttribute("aria-expanded", "false");
  button.innerText = "Minha conta";
  const ul = document.createElement("ul");
  ul.className = "dropdown-menu";
  const li = document.createElement("li");
  li.className = "dropdown-item";
  li.innerText = `Olá, ${userInfo.nome}`;
  ul.appendChild(li);

  const opcoes = [
    { href: "cadastro-evento.html", text: "Criar evento" },
    { href: "index.html?meusEventos=true", text: "Meus eventos" },
    { href: "configuracoes.html", text: "Configurações" },
    { href: "#", text: "Sair", onclick: "signOut()" },
  ];

  for (const opcao of opcoes) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    if (opcao.onclick) {
      li.onclick = () => utils.signOut(userInfo, axios);
    }

    a.className = "dropdown-item";
    a.setAttribute("href", opcao.href);
    a.innerText = opcao.text;
    li.appendChild(a);
    ul.appendChild(li);
  }
  userHeader.appendChild(button);
  userHeader.appendChild(ul);
}

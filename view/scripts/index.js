/* global axios */

const userInfo = JSON.parse(localStorage.getItem("token"));

const signOut = () => {
  const requisicao = axios.post("http://localhost:8080/sign-out", null, {
    headers: { Authorization: `Bearer ${userInfo.token}` },
  });
  requisicao
    .then(() => {
      localStorage.removeItem("token");
      location.reload();
    })
    .catch((e) => {
      const errorMsg = e.response.data.error ? e.response.data.error : e;
      const msg = `Algo deu errado, tente novamente\n${errorMsg}`;
      // eslint-disable-next-line no-alert
      alert(msg);
    });
};

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
    { href: "#", text: "Meus eventos" },
    { href: "#", text: "Configurações" },
    { href: "#", text: "Sair", onclick: "signOut()" },
  ];

  for (const opcao of opcoes) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    if (opcao.onclick) {
      li.setAttribute("onclick", opcao.onclick);
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

// const xhr = new XMLHttpRequest();
// // open the request
// xhr.open("GET", "http://localhost:8080/eventos");
// xhr.setRequestHeader("Content-Type", "application/json");

// // send the form data
// xhr.send();

// xhr.onreadystatechange = function (e) {
//   if (xhr.readyState === XMLHttpRequest.DONE) {
//     const eventos = e && e.target && JSON.parse(e.target.response);
//     console.log(eventos);
//     const container = document.querySelector("#lista-eventos");
//     console.log(container);
//     // container.innerHTML = ""
//   }
// };

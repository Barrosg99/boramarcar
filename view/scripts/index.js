/* global axios */

const requisicao = axios.get("http://localhost:8080/eventos");
requisicao
  .then((res) => {
    // <div class="card">
    //   <img src="../images/cervejada.png" class="card-img-top" alt="">
    //   <div class="card-body">
    //     <h5 class="card-title">Cervejada</h5>
    //     <p class="card-text">Breve descrição do evento.</p>
    //     <a href="#" class="btn btn-primary">bora marcar </a>
    //   </div>
    const { data } = res;
    const container = document.querySelector("#lista-eventos");
    container.innerHTML = "";
    for (const evento of data) {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = evento.url_imagem;
      img.className = "card-img-top";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const title = document.createElement("h5");
      title.className = "card-title";
      title.innerText = evento.nome;

      const subTitle = document.createElement("p");
      subTitle.className = "card-text";
      subTitle.innerText = evento.nome;

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
  })
  .catch((e) => {
    const errorMsg = e.response.data.error ? e.response.data.error : e;
    const msg = `Algo deu errado, tente novamente\n${errorMsg}`;
    // eslint-disable-next-line no-alert
    alert(msg);
  });

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

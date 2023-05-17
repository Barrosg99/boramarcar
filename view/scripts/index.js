const token = localStorage.getItem("token");
const userInfo = JSON.parse(token)

const signOut = () => {
  const xhr = new XMLHttpRequest();
  //open the request
  xhr.open('POST','http://localhost:8080/sign-out')
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization",`Bearer ${userInfo.token}`)

  //send the form data
  xhr.send();

  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          localStorage.removeItem("token");
          location.reload()
      }
  }
}

if(token) {
    const userHeader = document.querySelector("#navbarSupportedContent");
    console.log(userHeader);
    userHeader.innerHTML = "";
    userHeader.className = "btn-group"
    const button = document.createElement("button");
    button.className = "btn btn-danger dropdown-toggle";
    button.setAttribute("data-bs-toggle","dropdown");
    button.setAttribute("aria-expanded","false");
    button.innerText = "Minha conta";
    const ul = document.createElement("ul");
    ul.className = "dropdown-menu";
    const li = document.createElement("li");
    li.className = "dropdown-item";
    li.innerText = `Olá, ${userInfo.Nome_Razao_Social}`;
    ul.appendChild(li);

    const opcoes = [ 
        { href: "cadastro-evento.html", text: "Criar evento" },
        { href: "#", text: "Meus eventos" },
        { href: "#", text: "Configurações" },
        { href: "#", text: "Sair", onclick: "signOut()" }
    ];

    for (const opcao of opcoes) {
        const li = document.createElement("li");
        const a = document.createElement("a");

        if(opcao.onclick) {
          li.setAttribute("onclick",opcao.onclick)
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
const token = localStorage.getItem("token");
console.log(JSON.parse(token));
if(token) {
    userInfo = JSON.parse(token)
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
        { href: "#", text: "Criar evento" },
        { href: "#", text: "Meus eventos" },
        { href: "#", text: "Configurações" },
        { href: "#", text: "Sair" }
    ];

    for (const opcao of opcoes) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.setAttribute("href", opcao.href);
        a.innerText = opcao.text;
        li.appendChild(a);
        ul.appendChild(li);
    }
    userHeader.appendChild(button);
    userHeader.appendChild(ul);
}
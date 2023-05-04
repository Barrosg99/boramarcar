const token = localStorage.getItem("token");
console.log(JSON.parse(token));
if(token) {
    userInfo = JSON.parse(token)
    const userHeader = document.querySelector("#navbarSupportedContent");
    console.log(userHeader);
    userHeader.innerHTML = "";
    const p = document.createElement("p");
    p.innerText = `Ola ${userInfo.Nome_Razao_Social}`;
    userHeader.appendChild(p);
}
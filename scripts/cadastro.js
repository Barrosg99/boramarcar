// document.getElementById("btn-pessoal").addEventListener("click", function () {
//     let verificacaoEmail = verificaEmail(document.getElementById("input-email").value);
//     let verificacaoSenha = verificaSenha(document.getElementById("input-senha").value);
//     let verificacaoConfirmaSenha = (verificacaoSenha && (document.getElementById("input-senha").value == document.getElementById("input-confirma-senha").value));
//     let verificacaoCPF = verificaCPF(document.getElementById("input-cpf-cnpj").value);

//     if (!verificacaoEmail) {
//         alert("E-mail inválido!");
//     }

//     if (!verificacaoSenha) {
//         alert("Senha deve possuir pelo menos 6 caracteres e ser composta por números e letras!");
//     }

//     if (!verificacaoConfirmaSenha) {
//         alert("As senhas não coincidem!");
//     }

//     if (!verificacaoCPF) {
//         alert("CPF inválido!");
//     }

//     if (verificacaoEmail && verificacaoSenha && verificacaoConfirmaSenha && verificacaoCPF) {
//         //TODO: persistencia do usuario no BD
//         window.location.href = "sucesso-cadastro.html";
//     }

// });

// document.getElementById("btn-comercio").addEventListener("click", function () {
//     let verificacaoEmail = verificaEmail(document.getElementById("input-email").value);
//     let verificacaoSenha = verificaSenha(document.getElementById("input-senha").value);
//     let verificacaoConfirmaSenha = (verificacaoSenha && (document.getElementById("input-senha").value == document.getElementById("input-confirma-senha").value));
//     let verificacaoCNPJ = verificaCNPJ(document.getElementById("input-cpf-cnpj").value);

//     if (!verificacaoEmail) {
//         alert("E-mail inválido!")
//     }

//     if (!verificacaoSenha) {
//         alert("Senha deve possuir pelo menos 6 caracteres e ser composta por números e letras!");
//     }

//     if (!verificacaoConfirmaSenha) {
//         alert("As senhas não coincidem!");
//     }

//     if (!verificacaoCNPJ) {
//         alert("CNPJ inválido!")
//     }

//     if (verificacaoEmail && verificacaoSenha && verificacaoConfirmaSenha && verificacaoCNPJ) {
//         //TODO: persistencia do usuario no BD
//         window.location.href = "sucesso-cadastro.html";
//     }
// });

function getParameters() {
  var params    = new Array();
  var paramsRet = new Array();
  var url = window.location.href;     // Obtém a URL
  var paramsStart = url.indexOf("?"); // Procura ? na URL

  if(paramsStart != -1){ 
   // Encontrou ? na URL
    var paramString = url.substring(paramsStart + 1); // Retorna parte da URL após ?
    paramString = decodeURIComponent(paramString);    // Decodifica código de URI da URL
    var params = paramString.split("&"); // Retorna trechos da String separados por &
    for(var i = 0 ; i < params.length ; i++) {
      var pairArray = params[i].split("="); // Retorna trechos da String separados por =
      if(pairArray.length == 2){
        paramsRet[pairArray[0]] = pairArray[1];
      }

    }
    return paramsRet;
  }
  return null; // Não encontrou ? na URL
}

const password = document.getElementById("input-senha")
const confirm_password = document.getElementById("input-confirma-senha");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Senhas não se coincidem.");
  } else {
    confirm_password.setCustomValidity('');
  }
}

if(password) 
  password.onchange = validatePassword;
if(confirm_password) 
  confirm_password.onkeyup = validatePassword;

var params = new Array();
params = getParameters();
// console.log(params);
const form = document.querySelector("form.form-cadastro");
// console.log(form);
if(form && params)
  for (let [key, value] of Object.entries(params)) {
      const input = document.createElement("input");
      input.setAttribute("name",key)
      input.hidden = true;
      input.setAttribute("value",value)
      form.appendChild(input)
  }
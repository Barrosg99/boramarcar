import * as utils from "./utils.js";

const senha = document.getElementById("input-senha");
const confirmacaoSenha = document.getElementById("input-confirma-senha");
const email = document.getElementById("input-email");

if (senha) {
  senha.onchange = () => utils.verificaSenha(senha, confirmacaoSenha);
}
if (confirmacaoSenha) {
  confirmacaoSenha.onkeyup = () => utils.verificaSenha(senha, confirmacaoSenha);
}
if (email) {
  email.onchange = () => utils.verificaEmail(email);
}

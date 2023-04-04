document.getElementById("btn-pessoal").addEventListener("click", function () {
    let verificacaoEmail = verificaEmail(document.getElementById("input-email").value);
    let verificacaoSenha = verificaSenha(document.getElementById("input-senha").value);
    let verificacaoConfirmaSenha = (verificacaoSenha && (document.getElementById("input-senha").value == document.getElementById("input-confirma-senha").value));
    let verificacaoCPF = verificaCPF(document.getElementById("input-cpf-cnpj").value);

    if (!verificacaoEmail) {
        alert("E-mail inválido!");
    }

    if (!verificacaoSenha) {
        alert("Senha deve possuir pelo menos 6 caracteres e ser composta por números e letras!");
    }

    if (!verificacaoConfirmaSenha) {
        alert("As senhas não coincidem!");
    }

    if (!verificacaoCPF) {
        alert("CPF inválido!");
    }

    if (verificacaoEmail && verificacaoSenha && verificacaoConfirmaSenha && verificacaoCPF) {
        //TODO: persistencia do usuario no BD
        window.location.href = "sucesso-cadastro.html";
    }

});

document.getElementById("btn-comercio").addEventListener("click", function () {
    let verificacaoEmail = verificaEmail(document.getElementById("input-email").value);
    let verificacaoSenha = verificaSenha(document.getElementById("input-senha").value);
    let verificacaoConfirmaSenha = (verificacaoSenha && (document.getElementById("input-senha").value == document.getElementById("input-confirma-senha").value));
    let verificacaoCNPJ = verificaCNPJ(document.getElementById("input-cpf-cnpj").value);

    if (!verificacaoEmail) {
        alert("E-mail inválido!")
    }

    if (!verificacaoSenha) {
        alert("Senha deve possuir pelo menos 6 caracteres e ser composta por números e letras!");
    }

    if (!verificacaoConfirmaSenha) {
        alert("As senhas não coincidem!");
    }

    if (!verificacaoCNPJ) {
        alert("CNPJ inválido!")
    }

    if (verificacaoEmail && verificacaoSenha && verificacaoConfirmaSenha && verificacaoCNPJ) {
        //TODO: persistencia do usuario no BD
        window.location.href = "sucesso-cadastro.html";
    }
});

function cadastro() {
    window.location.href = "sucesso-cadastro.html";
}
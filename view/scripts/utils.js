function verificaEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
        return false;
    } else {
        return true;
    }
}

function verificaCPF(cpf) {

    //01234567890

    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    for (let i = 0; i < 10; i++) {
        if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
            break;
        }
        if (i === 9) {
            return false;
        }
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let mod = sum % 11;
    let dv1 = (mod < 2) ? 0 : 11 - mod;
    if (parseInt(cpf.charAt(9)) !== dv1) {
        return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    mod = sum % 11;
    let dv2 = (mod < 2) ? 0 : 11 - mod;
    if (parseInt(cpf.charAt(10)) !== dv2) {
        return false;
    }

    return true;
}

function verificaCNPJ(cnpj) {

    //72553815000109
    
    cnpj = cnpj.replace(/[^\d]/g, "");

    if (cnpj.length !== 14) {
        return false;
    }

    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = (weight === 2) ? 9 : weight - 1;
    }
    let digit1 = sum % 11;
    digit1 = digit1 < 2 ? 0 : 11 - digit1;

    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj.charAt(i)) * weight;
        weight = (weight === 2) ? 9 : weight - 1;
    }
    let digit2 = sum % 11;
    digit2 = digit2 < 2 ? 0 : 11 - digit2;

    return (digit1 === parseInt(cnpj.charAt(12)) && digit2 === parseInt(cnpj.charAt(13)));
}

function verificaSenha(senha) {
    if (senha.length < 6) {
      return false;
    }
  
    let alfanumerico = /^[0-9a-zA-Z]+$/;
    if (!senha.match(alfanumerico)) {
      return false;
    }
  
    return true;
  }
  
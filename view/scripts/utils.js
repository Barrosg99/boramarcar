function verificaEmail(email) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email.value)) {
        email.setCustomValidity("Formato não aceito.");
    } else {
        email.setCustomValidity("")
    }
}

function verificaSenha(){ 
    if(password.value != confirm_password.value) {
      confirm_password.setCustomValidity("Senhas não se coincidem.");
    } else {
      confirm_password.setCustomValidity('');
    }
  }
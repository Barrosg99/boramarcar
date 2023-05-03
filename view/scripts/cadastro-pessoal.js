// const form = document.querySelector("form.form-cadastro");

form.onsubmit = function(event){
  const xhr = new XMLHttpRequest();
  const formData = new FormData(form);
  //open the request
  xhr.open('POST','http://localhost:8080/pessoas')
  xhr.setRequestHeader("Content-Type", "application/json");

  //send the form data
  xhr.send(JSON.stringify(Object.fromEntries(formData)));

  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          window.location.href = "index.html"
      }
  }
  //Fail the onsubmit to avoid page refresh.
  return false; 
}
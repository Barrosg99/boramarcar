import * as utils from "./utils.js";

const api = utils.api();

const form = document.querySelector("form");

form.onsubmit = () => {
  // const submitButton = document.getElementById("btn-pessoal");
  const formData = new FormData(form);
  // submitButton.disabled = true;
  const requisicao = api.post("/admin", Object.fromEntries(formData));
  requisicao
    .then((res) => {
      localStorage.setItem("token", JSON.stringify(res.data));
      form.innerHTML = "";
    })
    .catch((e) => {
      const errorMsg = e.response ? e.response.data.error || e.message : e;
      alert(`${errorMsg}`);
    })
    .finally(() => {
      // submitButton.disabled = false;
    });

  return false;
};

import * as utils from "./utils.js";

const api = utils.api();
const { token } = utils.getToken();

const params = new URLSearchParams(location.search);
const entries = params.entries();
const filter = Object.fromEntries(entries);
const { tabela, id } = filter;

const main = document.getElementById("root");

const homeAutenticada = () => {
  main.innerHTML = `<h1 style="color: white;"><a href="index.html" style="color: inherit;text-decoration: none;" >ADMIN BORA MARCAR</a></h1>
    <div class="list-group" style="margin-top: 30px; width: 80%;">
      <a href="index.html?tabela=pessoa" class="list-group-item list-group-item-action ">Pessoa</a>
      <a href="index.html?tabela=estabelecimento" class="list-group-item list-group-item-action">Estabelecimento</a>
      <a href="index.html?tabela=evento" class="list-group-item list-group-item-action">Evento</a>
    </div>`;
};

const login = () => {
  main.innerHTML = `<h1 style="color: white;"><a href="index.html" style="color: inherit;text-decoration: none;">ADMIN BORA MARCAR</a>
    </h1>
    <form style="background: white;padding: 70px;border-radius: 10px;">
      <div class="mb-3">
        <label for="username" class="form-label">Nome de usuário</label>
        <input type="username" required class="form-control" id="username" name="username">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Senha</label>
        <input type="password" required class="form-control" id="password" name="password">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>`;
};

if (!token) {
  login();
  const form = document.querySelector("form");

  form.onsubmit = () => {
    const submitButton = document.querySelector("form button");
    const formData = new FormData(form);
    submitButton.disabled = true;
    const requisicao = api.post("/admin", Object.fromEntries(formData));
    requisicao
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.data));
        homeAutenticada();
      })
      .catch((e) => {
        const errorMsg = e.response ? e.response.data.error || e.message : e;
        alert(`${errorMsg}`);
      })
      .finally(() => {
        submitButton.disabled = false;
      });

    return false;
  };
} else if (!tabela) {
  homeAutenticada();
} else if (tabela === "pessoa") {
  if (!id) {
    const { data: pessoas } = await api.get("admin/pessoas", {
      headers: {
        Authorization: `Bearer ${token}`,
        from: "admin",
      },
    });
    let links = "";
    for (const pessoa of pessoas) {
      const linkPessoa = `<a href="index.html?tabela=pessoa&id=${pessoa.id}" class="list-group-item list-group-item-action ">${pessoa.id} - ${pessoa.nome}</a>`;
      links += linkPessoa;
    }
    main.innerHTML = `<h1 style="color: white;"><a href="index.html" style="color: inherit;text-decoration: none;" >ADMIN BORA MARCAR</a></h1>
    <div class="list-group" style="margin-top: 30px;width: 80%;">
      ${links}
    </div>`;
  } else {
    main.innerHTML = `<h1 style="color: white;"><a href="index.html" style="color: inherit;text-decoration: none;">ADMIN BORA MARCAR</a>
    </h1>
    <form style="background: white;padding: 20px 20px 15px 15px;border-radius: 10px;width: 80%;margin-bottom: 20px;">
      <div class="mb-3">
        <label for="id" class="form-label">ID </label>
        <input type="text" readonly class="form-control" id="id" name="id">
      </div>
      <div class="mb-3">
        <label for="nome" class="form-label">Nome </label>
        <input type="text" required class="form-control" id="nome" name="nome">
      </div>
      <div class="mb-3">
        <label for="dataNascimento" class="form-label">Data de Nascimento</label>
        <input type="text" required class="form-control" id="dataNascimento" name="dataNascimento">
      </div>
      <div class="mb-3">
        <label for="cpf" class="form-label">CPF</label>
        <input type="text" required class="form-control" id="cpf" name="cpf">
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="text" required class="form-control" id="email" name="email">
      </div>
      <div class="mb-3">
        <label for="telefone" class="form-label">Telefone</label>
        <input type="text" required class="form-control" id="telefone" name="telefone">
      </div>
      <div style="display: flex;justify-content: space-evenly;">
        <button type="submit" class="btn btn-primary">Salvar</button>
        <button type="button" class="btn btn-danger">Excluir</button>
      </div>
    </form>`;

    const { data: pessoa } = await api.get(`admin/pessoas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        from: "admin",
      },
    });

    const allInputs = document.querySelectorAll("input");
    for (const input of allInputs) {
      if (input.name === "dataNascimento") {
        input.value = pessoa[input.name].split("T")[0];
        continue;
      }
      input.value = pessoa[input.name];
    }

    const form = document.querySelector("form");
    const excluirButton = document.querySelector("form .btn-danger");

    excluirButton.onclick = () => {
      api
        .delete(`/admin/pessoas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            from: "admin",
          },
        })
        .then(() => {
          alert("Usuario excluido");
        })
        .catch((e) => {
          const errorMsg = e.response ? e.response.data.error || e.message : e;
          alert(`${errorMsg}`);
        })
        .finally(() => {
          utils.goTo("index.html?tabela=pessoa");
        });
    };

    form.onsubmit = () => {
      const submitButton = document.querySelector("form .btn-primary");
      const formData = new FormData(form);
      const body = Object.fromEntries(formData);
      submitButton.disabled = true;
      const requisicao = api.post(`/admin/pessoas/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          from: "admin",
        },
      });

      requisicao
        .then(() => {
          alert("Dados salvos");
        })
        .catch((e) => {
          const errorMsg = e.response ? e.response.data.error || e.message : e;
          alert(`${errorMsg}`);
        })
        .finally(() => {
          submitButton.disabled = false;
        });

      return false;
    };
  }
}

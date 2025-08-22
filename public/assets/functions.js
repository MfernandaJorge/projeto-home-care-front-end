function showContent(id) {
  document.querySelectorAll('.content').forEach(div => div.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function login() {
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;

  fetch("app/models/login.php?action=login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user, password })
  })
  .then(response => response.text())
  .then(data => {
    console.log("Resposta do servidor:", data);

    try {
      const jsonData = JSON.parse(data);

      if (jsonData.success) {
        alert("Bem-vindo ao HomeMed Care")
        window.location.href = "app/views/home.php";

      } else {
        alert("Usuário ou senha incorretos.");
      }

    } catch (error) {
      console.error("Erro ao processar JSON:", error, "Resposta recebida:", data);
    }
  })
  .catch(error => console.error("Erro na requisição:", error));
}

function openForm() {
  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const btnAbrir = document.getElementById("btn-novo-atendimento");
    const btnFechar = document.querySelector(".close");

    btnAbrir.addEventListener("click", function () {
      modal.style.display = "flex";
    });

    btnFechar.addEventListener("click", function () {
      modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
}

function novoPaciente() {
  const form = document.getElementById("form-pacientes");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(data);

    fetch("../../app/models/home.php?action=novoPaciente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }
      return response.json();
    })
    .then(result => {
      console.log("Resultado:", result);
      if (result.success) {
        alert("Paciente cadastrado com sucesso!");
        form.reset(); // Limpa os campos
        location.reload();

      } else {
        alert("Erro ao cadastrar paciente: " + result.message);
      }
    })
    // .catch(error => {
    //   console.error("Erro na requisição:", error);
    //   alert("Erro ao enviar os dados. Tente novamente.");
    // });
  });
}

function novoProfissional() {
  const form = document.getElementById("form-profissionais");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(data);

    fetch("../../app/models/profissionais.php?action=novoProfissional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }

      return response.json();
    })
    .then(result => {
      if (result.success) {
        alert("Profissional cadastrado com sucesso!");
        form.reset(); // Limpa os campos
        location.reload();

      } else {
        alert("Erro ao cadastrar profissional: " + result.message);
      }
    })
    // .catch(error => {
    //   console.error("Erro na requisição:", error);
    //   alert("Erro ao enviar os dados. Tente novamente.");
    // });
  });
}

function novoAtendimento() {
  const form = document.getElementById("form-atendimento");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(data);

    fetch("../../app/models/atendimento.php?action=novoAtendimento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }

      return response.json();
    })
    .then(result => {
      if (result.success) {
        alert("Atendimento cadastrado com sucesso!");
        form.reset(); // Limpa os campos
        location.reload();

      } else {
        alert("Erro ao cadastrar atendimento: " + result.message);
      }
    })
    // .catch(error => {
    //   console.error("Erro na requisição:", error);
    //   alert("Erro ao enviar os dados. Tente novamente.");
    // });
  });
}

function excluirAtendimento(id) {
  if (confirm("Tem certeza que deseja excluir este atendimento?")) {
    fetch('../controllers/deleteAtendimento.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("Atendimento excluído com sucesso!");
        // document.getElementById("linha-" + id).remove(); // Remove a linha da tabela
        location.reload();
      } else {
        alert("Erro ao excluir: " + data.message);
      }
    })
    // .catch(error => {
    //   console.error("Erro ao excluir:", error);
    //   alert("Erro ao excluir o atendimento.");
    // });
  }
}

function excluirPaciente(id) {
  if (confirm("Tem certeza que deseja excluir este paciente?")) {
    fetch('../controllers/deletePaciente.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("Paciente excluído com sucesso!");
        // document.getElementById("linha-" + id).remove(); // Remove a linha da tabela
        location.reload();
      } else {
        alert("Erro ao excluir: " + data.message);
      }
    })
    // .catch(error => {
    //   console.error("Erro ao excluir:", error);
    //   alert("Erro ao excluir o atendimento.");
    // });
  }
}

function excluirProfissional(id) {
  if (confirm("Tem certeza que deseja excluir este profissional?")) {
    fetch('../controllers/deleteProfissional.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert("Profissional excluído com sucesso!");
        // document.getElementById("linha-" + id).remove(); // Remove a linha da tabela
        location.reload();
      } else {
        alert("Erro ao excluir: " + data.message);
      }
    })
    // .catch(error => {
    //   console.error("Erro ao excluir:", error);
    //   alert("Erro ao excluir o atendimento.");
    // });
  }
}

function salvarEdicao() {
  const form = document.getElementById("form-edicao-instituicao");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(data);

    fetch('../controllers/edicaoCadastro.php?action=salvarEdicao', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }
      return response.json();
    })
    .then(result => {
      console.log(result);

      if (result.success) {
        alert("Edição do cadastro salvo com sucesso!");
        form.reset(); // Limpa os campos
        location.reload();

      } else {
        alert("Erro ao editar cadastro: " + result.message);
      }
    });
    // .catch(error => {
    //   console.error("Erro na requisição:", error);
    //   alert("Erro ao enviar os dados. Tente novamente.");
    // });
  });
}
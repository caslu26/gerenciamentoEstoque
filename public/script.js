document.addEventListener("DOMContentLoaded", function () {
  const addForm = document.getElementById("addForm");
  const estoqueTableBody = document.querySelector("#estoque tbody");

  function refreshTable() {
    fetch("/estoque")
      .then((response) => response.json())
      .then((data) => {
        estoqueTableBody.innerHTML = "";
        data.forEach(function (produto) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.qnt}</td>
            <td>
              <button onclick="editProduto(${produto.id})">Editar</button>
              <button onclick="deleteProduto(${produto.id})">Excluir</button>
            </td>
          `;
          estoqueTableBody.appendChild(row);
        });
      })
      .catch((error) =>
        console.error("Erro ao obter dados do servidor:", error)
      );
  }

  refreshTable();

  addForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const categoria = document.getElementById("categoria").value;
    const qnt = document.getElementById("qnt").value;

    fetch("/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome: nome, categoria: categoria, qnt: qnt }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao adicionar produto");
        }
        return response.json();
      })
      .then(() => {
        refreshTable();
        addForm.reset();
      })
      .catch((error) => console.error("Erro ao adicionar produto:", error));
  });
});

function deleteProduto(id) {
  fetch(`/estoque/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao excluir produto");
      }
      return response.text(); // Alterado para retorno de texto
    })
    .then((message) => {
      console.log(message); // Apenas exibe a mensagem
      refreshTable();
    })
    .catch((error) => console.error("Erro ao excluir produto:", error));
}

function editProduto(id) {
  const nome = prompt("Novo nome:");
  const categoria = prompt("Nova categoria:");
  const qnt = prompt("Nova quantidade")

  fetch(`/estoque/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, categoria, qnt }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao editar produto");
      }
      return response.text(); // Alterado para retorno de texto
    })
    .then((message) => {
      console.log(message); // Apenas exibe a mensagem
      refreshTable();
    })
    .catch((error) => console.error("Erro ao editar produto:", error));
}

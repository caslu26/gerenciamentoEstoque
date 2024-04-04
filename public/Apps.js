const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const port = 3002;

app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

const dbConnection = new sqlite3.Database("estoque.db");
dbConnection.serialize(() => {
  dbConnection.run(`
    CREATE TABLE IF NOT EXISTS estoque (
      id INTEGER PRIMARY KEY,
      nome TEXT,
      categoria TEXT,
      qnt TEXT
    )
  `);
});

// Define a rota para lidar com a solicitação POST para /admin
app.post("/admin", (req, res) => {
  const { nome, categoria, qnt } = req.body;

  const sql = "INSERT INTO estoque (nome, categoria, qnt) VALUES (?, ?, ?)";

  dbConnection.run(sql, [nome, categoria, qnt], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Erro durante a inserção no banco de dados.");
    } else {
      console.log("Dados inseridos com sucesso no banco de dados.");
      res.redirect("/estoque.html");
    }
  });
});

app.get("/estoque", (req, res) => {
  dbConnection.all("SELECT * FROM estoque", (err, rows) => {
    if (err) {
      console.error("Erro ao buscar dados do estoque:", err.message);
      return res.status(500).send("Erro ao buscar dados do estoque.");
    } else {
      res.json(rows);
    }
  });
});

function adicionar_produto(nome, categoria, qnt) {
  const sql = "INSERT INTO estoque (nome, categoria, qnt) VALUES (?, ?, ?)";
  dbConnection.run(sql, [nome, categoria, qnt], function (err) {
    if (err) {
      console.error("Erro ao adicionar produto:", err.message);
    } else {
      console.log("Produto adicionado com sucesso.");
      // refreshTable(); // Esta função não é acessível aqui
    }
  });
}

function listar_produto(callback) {
  const sql = "SELECT id, nome, categoria FROM estoque";
  dbConnection.all(sql, [], (err, rows) => {
    if (err) throw err;
    callback(rows);
  });
}

function atualizar_produto(id, nome, categoria,qnt) {
  const sql = "UPDATE estoque SET nome = ?, categoria = ? qnt = ? WHERE id = ?";
  dbConnection.run(sql, [id,nome, categoria,qnt]);
}

function deletar_produto(id) {
  const sql = "DELETE FROM estoque WHERE id = ?";
  dbConnection.run(sql, [id]);
}

app.put("/estoque/:id", (req, res) => {
  const id = req.params.id;
  const { nome, categoria,qnt } = req.body;

});



const sql = "SELECT * FROM estoque";

dbConnection.all(sql, [], function (err, rows) {
  if (err) {
    console.error(err.message);
    return;
  }
});

module.exports = {
  adicionar_produto,
  listar_produto,
  atualizar_produto,
  deletar_produto,
  dbConnection,
};

app.get("/", (req, res) => {
  res.send(`Servidor rodando em http://localhost:${port}`);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

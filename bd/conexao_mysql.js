//importar modulo sql2
const mysql = require('mysql2');

// 3. Estabelecer a conexão com o banco de dados MySQL
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projeto'
  });
  
  // Testar a conexão
  conexao.connect(function(erro) {
    if (erro) throw erro;
    console.log("Conexao Efetuada com Sucesso");
  });

  module.exports = conexao;
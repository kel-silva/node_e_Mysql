// 1. Importar express-handlebars e extrair a função engine()
const express = require('express');

//importar modo upload
const fileupload = require ('express-fileupload');
//
const { engine } = require('express-handlebars');

//importar modulo sql2
const mysql = require('mysql2');
//File system
const fs =require ('fs');

//

// 2. Configurar o Express para usar Handlebars
//app
const app = express();

// habilitando o upload de arquivos
app.use(fileupload());
//

//adicionar bootstrap
app.use('/bootstrap', express.static ('./node_modules/bootstrap/dist'))

//adcionar css adiciona o caminho do css
app.use('/css', express.static('./css'));

//referenciar a pasta de imagem
app.use('/imagens', express.static('./imagens'))

//condiguracao do
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//manipulaçao de dados via rota

app.use(express.json());
app.use(express.urlencoded({extended: false}));
//

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

// Rota principal
app.get('/', function(req, res) {

  //SQL
    let  sql = "SELECT * FROM produtos";
    //executando comando
    conexao.query(sql,function(erro,retorno){
      res.render('formulario',{produtos:retorno});

    });
});

//rota principal contendo a situacao
app.get('/:situacao', function(req, res) {

  //SQL
    let  sql = "SELECT * FROM produtos";
    //executando comando
    conexao.query(sql,function(erro,retorno){
      res.render('formulario',{produtos:retorno, situacao:req.params.situacao});

    });
});

//fim da tora principal contendo situacao

//rota cadastrar
app.post('/cadastrar', function(req,res){
   try {
    //obter os dados que sao utilizado para o cadastro
   let nome = req.body.nome;
   let valor = req.body.valor;
   let imagem = req.files.imagem.name;

   //validar nome do produto e o valor

   if (nome == ''  || valor == ''  || isNaN(valor)) {
    res.redirect('/falhaCadastro ')
    
   }else{

            //sql
            let sql = `INSERT INTO produtos(nome,valor,imagem) VALUES ('${nome}',${valor},'${imagem}')`;

            //Executar comando SQL
            conexao.query(sql, function(erro,retorno){
            // caso ocorra algum erro
            if (erro) throw  erro;
            // caso ocorra o cadastro

            req.files.imagem.mv(__dirname+'/imagens/'+req.files.imagem.name);
            console.log(retorno);

            });

            //retornar para a rota principal
            res.redirect('/okCadastro')

   }

   
   } catch (erro) {
     res.redirect('/falhaCadastro')
   }

 


});
  // rota de remover produtos
  app.get('/remover/:codigo&:imagem',function(req,res){
  let sql = `DELETE FROM produtos  WHERE codigo = ${req.params.codigo}`;


  //executar comando sql
  conexao.query(sql, function(erro, retorno){
      // caso falhe o comando sql
      if(erro) throw erro;
      // caso o comando funcione faz a remocao do arquivo
      fs.unlink(__dirname+'/imagens/'+ req.params.imagem, (erro_imagem)=>{
        if (erro_imagem) {
          console.log("Falha ao remover a imagem: " + erro_imagem.message);
          return;
        }
        console.log("Imagem removida com sucesso.");
      });
    });
  
    res.redirect('/');
  });

  //rota para redirecionar para o formulario  de alteracao edicao
  app.get('/formularioEditar/:codigo', function(req,res){
 //sql
 let sql = `SELECT * from produtos WHERE  codigo =${req.params.codigo}`;


 //executar comando Sql 

 conexao.query(sql, function(erro, retorno){
  //caso ocorra algum erro
    if (erro) throw erro;

    //caso consiga executar comando SQL
    res.render ('formularioEditar', {produto:retorno[0]})
 })

  });
  //rota para editar produtos

  app.post('/editar',function(req,res){
    //obter is dados do formulario
      let nome = req.body.nome;
      let valor = req.body.valor;
      let codigo = req.body.codigo;
      let nomeImagem = req.body.nomeImagem;
      
       //definir tipo d e edicao
   try{

    //objeto da imagem
    let  imagem = req.files.imagem.name;
 
   
    //sql 

    let sql =`UPDATE produtos SET nome='${nome}',  valor=${valor}, imagem=  '${imagem.name}'  WHERE codigo=${codigo} `;

  // executar comando SQL
   conexao.query(sql, function(erro, retorno){

    // caso falhe o comando SQl
    if(erro) throw erro;

    //remover imagem antiga
    fs.unlink(__dirname+'/imagens/'+ nome.imagem,(erro_imagem)=>{
      console.log('falha ao remover a imagem');
    });

    //cadastrar nova imagem
    imagem.mv(__dirname+'imagens'+ imagem.name);


     
   }); 
  }catch(erro){
    let sql =`UPDATE produtos SET nome='${nome}',  valor=${valor} WHERE codigo=${codigo} `;

    //executar comando SQl
    conexao.query (sql, function(erro, retorno){
        //caso falhe o comando Sql
        if(erro) throw erro;
    });
  }
    //redirecionamento
    res.redirect('/');
  })
  // Iniciar o servidor
  app.listen(8080);
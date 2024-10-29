const conexao = require('../bd/conexao_mysql');

// Importar o módulo file system
const fs = require('fs');

// Função para exibir o formulário para cadastro de produtos
function formularioCadastro(req, res){ 
    res.render('formulario');
}

// Função para exibir o formulário para cadastro de produtos e a situação
function formularioCadastroComSituacao(req, res){

    res.render('formulario',{ situacao:req.params.situacao});
}

// Função para exibir o formulário para edição de produtos
function formularioEditar(req, res){

         //sql
 let sql = `SELECT * from produtos WHERE  codigo =${req.params.codigo}`;


 //executar comando Sql 

 conexao.query(sql, function(erro, retorno){
  //caso ocorra algum erro
    if (erro) throw erro;

    //caso consiga executar comando SQL
    res.render ('formularioEditar', {produto:retorno[0]})
 })
}

// Função para exibir a listagem de produtos
function listagemProdutos(req, res){

     //obter caategoria
     let categoria = req.params.categoria;


     //SQL
       let sql = '';
     if (categoria == 'todos'){
       sql  = "SELECT * FROM produtos";
   }else{
         sql = `SELECT * FROM produtos WHERE categoria = '${categoria}'`
   }

   //executar comando sql
   conexao.query(sql,function(erro,retorno){
     res.render('lista',{produtos:retorno});

   });
}

// Função para realizar a pesquisa de produtos
function pesquisa(req, res){
    //obter o termo pesquisar

    let termo = req.body.termo;

    //SQl
      let sql = `SELECT * FROM produtos WHERE nome LIKE '%${termo}%'`;

      //executar comando sql
      conexao.query(sql,function(erro, retorno){

        let semRegistros = retorno.length == 0 ? true : false;
        res.render('lista',{produtos:retorno, semRegistros:semRegistros});
  
      });
}



// Função para realizar o cadastro de produtos
function cadastrarProduto(req, res){

    try {
        //obter os dados que sao utilizado para o cadastro
       let nome = req.body.nome;
       let valor = req.body.valor;
       let categoria = req.body.categoria;
       let imagem = req.files.imagem.name;
    
       //validar nome do produto e o valor
    
       if (nome == ''  || valor == ''  || isNaN(valor)  || categoria  == '') {
    
        res.redirect('/falhaCadastro ')
        
       }else{
    
                //sql
                let sql = `INSERT INTO produtos(nome,valor,imagem, categoria) VALUES ('${nome}',${valor},'${imagem}','${categoria}')`;
    
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
}

// Função para realizar a remoção de produtos
function removerProduto(req, res){


   try {

                  //SQL
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
              
                res.redirect('/okRemover');
    
   } catch (error) {
    res.redirect('/falhaREmover')
   }
}

// Função responsável pela edição de produtos
function editarProduto(req, res){

     //obter is dados do formulario
     let nome = req.body.nome;
     let valor = req.body.valor;
     let codigo = req.body.codigo;
     let nomeImagem = req.body.nomeImagem;

     //validar nome do produto e valor 
     if (nome =='' || valor == '' || isNaN(valor)) {
       res.redirect('/falhaEdicao');
       }else{


       
     
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
             res.redirect('/okEdicao');
         }
}

// Exportar funções
module.exports = {
    formularioCadastro,
    formularioCadastroComSituacao,
    formularioEditar,
    listagemProdutos,
    pesquisa,
    cadastrarProduto,
    removerProduto,
    editarProduto
};
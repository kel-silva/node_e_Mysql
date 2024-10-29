// 1. Importar express
const express = require('express');



//importar modo upload
const fileupload = require ('express-fileupload');
//
const { engine } = require('express-handlebars');




//importar modulo de servicos

const servico = require ('./servicos/produtos_servico');


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
app.engine('handlebars', engine({
  helpers: {
    // Função auxiliar para verificar igualdade
    condicionalIgualdade: function (parametro1, parametro2, options) {
      return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

//manipulaçao de dados via rota

app.use(express.json());
app.use(express.urlencoded({extended: false}));
//



// Rota principal
app.get('/', function(req, res) {

  servico.formularioCadastro(req,res)
   
     

    
});

//rota principal contendo a situacao
app.get('/:situacao', function(req, res) {

  servico.formularioCadastroComSituacao(req,res)
     

   
});

//fim da tora principal contendo situacao

//rota de listamgem
    app.get('/listar/:categoria',function(req, res){


     servico.listagemProdutos(req,res )

    })

    //rota de pesquisa

    app.post('/pesquisa', function(req,res){

      servico.pesquisa(req,res)

    });
//

//rota cadastro
app.post('/cadastrar', function(req,res){
  

 
servico.cadastrarProduto(req,res)

});
  // rota de remover produtos
  app.get('/remover/:codigo&:imagem',function(req,res){

  servico.removerProduto(req,res)
  });

  //rota para redirecionar para o formulario  de alteracao edicao
  app.get('/formularioEditar/:codigo', function(req,res){
 
 servico.formularioEditar(req,res)
 
    

  });
  //rota para editar produtos

  app.post('/editar',function(req,res){
   
        servico.editarProduto(req,res)
  })
  // Iniciar o servidor
  app.listen(8080);
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const servico = require('../servicos/produtos_servico');

// *** ADICIONE SUAS ROTAS AQUI


// Rota principal
router.get('/', function(req, res) {

    servico.formularioCadastro(req,res)
     
       
  
      
  });
  
  //rota principal contendo a situacao
  router.get('/:situacao', function(req, res) {
  
    servico.formularioCadastroComSituacao(req,res)
       
  
     
  });
  
  //fim da tora principal contendo situacao
  
  //rota de listamgem
  router.get('/listar/:categoria',function(req, res){
  
  
       servico.listagemProdutos(req,res )
  
      })
  
      //rota de pesquisa
  
      router.post('/pesquisa', function(req,res){
  
        servico.pesquisa(req,res)
  
      });
  //
  
  //rota cadastro
  router.post('/cadastrar', function(req,res){
    
  
   
  servico.cadastrarProduto(req,res)
  
  });
    // rota de remover produtos
    router.get('/remover/:codigo&:imagem',function(req,res){
  
    servico.removerProduto(req,res)
    });
  
    //rota para redirecionar para o formulario  de alteracao edicao
    router.get('/formularioEditar/:codigo', function(req,res){
   
   servico.formularioEditar(req,res)
   
      
  
    });
    //rota para editar produtos
  
    router.post('/editar',function(req,res){
     
          servico.editarProduto(req,res)
    })

// Exportar o router
module.exports = router;
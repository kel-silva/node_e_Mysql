// 1. Importar express
const express = require('express');



//importar modo upload
const fileupload = require ('express-fileupload');
//
const { engine } = require('express-handlebars');




//importar modulo de rotas
 const rota_produto = require('./rotas/produtos_rota')




//  Configurar o Express para usar Handlebars
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


//rotas
app.use('/', rota_produto)



  // Iniciar o servidor
  app.listen(8080);
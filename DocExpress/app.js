const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração de middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));

// Configurar o EJS como mecanismo de visualização
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rota de Login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) throw err;

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.userId = user.id;
      return res.redirect('/residencia');
    } else {
      res.send('Username ou senha estão incorretos');
    }
  });
});

// Middleware de autenticação
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Rota de Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Rotas Protegidas
app.get('/residencia', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'residencia.html'));
});

app.get('/autorizacao', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autorizacao.html'));
});

// Salvar Documento
app.post('/salvar_documento', (req, res) => {
  const { responsavel_nome, responsavel_nacionalidade, responsavel_rg, responsavel_cpf, endereco, numero, bairro, cidade, estado, menor_nome, menor_rg, menor_cpf, destino, pdf_url } = req.body;

  // Salvar no banco de dados
  db.run(`INSERT INTO documentos (responsavel_nome, responsavel_nacionalidade, responsavel_rg, responsavel_cpf, endereco, numero, bairro, cidade, estado, menor_nome, menor_rg, menor_cpf, destino, pdf_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [responsavel_nome, responsavel_nacionalidade, responsavel_rg, responsavel_cpf, endereco, numero, bairro, cidade, estado, menor_nome, menor_rg, menor_cpf, destino, pdf_url, req.session.userId],
      function(err) {
          if (err) {
              console.error('Erro ao salvar no banco:', err);
              res.status(500).send('Erro ao salvar no banco de dados');
          } else {
              res.send('Documento salvo com sucesso!');
          }
      }
  );
});

// Rota da Autorização para Hospedagem
app.get('/hospedagem', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hospedagem.html'));
});


app.post('/hospedagem_submit', isAuthenticated, (req, res) => {
  const {
    nome_responsavel, nacionalidade, rg, cpf, endereco, numero, bairro, cidade, estado,
    nome_menor, estabelecimento, endereco_estabelecimento, numero_estabelecimento,
    bairro_estabelecimento, cidade_estabelecimento, estado_estabelecimento,
    data_inicio, data_fim, pdf_url
  } = req.body;

  // Salvar no banco de dados
  db.run(`INSERT INTO documentos (responsavel_nome, nacionalidade, rg, cpf, endereco, numero, bairro, cidade, estado, menor_nome, estabelecimento, endereco_estabelecimento, numero_estabelecimento, bairro_estabelecimento, cidade_estabelecimento, estado_estabelecimento, data_inicio, data_fim, pdf_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nome_responsavel, nacionalidade, rg, cpf, endereco, numero, bairro, cidade, estado,
      nome_menor, estabelecimento, endereco_estabelecimento, numero_estabelecimento,
      bairro_estabelecimento, cidade_estabelecimento, estado_estabelecimento,
      data_inicio, data_fim, pdf_url, req.session.userId
    ],
    function(err) {
      if (err) {
        console.error('Erro ao salvar no banco:', err);
        res.status(500).send('Erro ao salvar no banco de dados');
      } else {
        res.send('Documento de hospedagem salvo com sucesso!');
      }
    }
  );
});

// Rota para a página de termo de quitação
app.get('/termo_quitacao', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'termo_quitacao.html')); // Enviar o arquivo HTML da página de termo de quitação
});

// Rota para a página de termo de quitação
app.get('/recibo_pagamento', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recibo_pagamento.html')); // Enviar o arquivo HTML da página de termo de quitação
});

// Rota para a página de união estavel
app.get('/uniao_estavel', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'uniao_estavel.html')); // Enviar o arquivo HTML da página de termo de quitação
});


// Rota da Declaração de Trabalhador Autônomo
app.get('/trabalho_autonomo', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'trabalho_autonomo.html'));
});

// Rota da autorizaçao acompanhado
app.get('/autorizacao_acomp', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'autorizacao_acom.html'));
});

// Rota da autorizaçao acompanhado
app.get('/auto_residencia', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auto_residencia.html'));
});



app.post('/trabalho_autonomo_submit', isAuthenticated, (req, res) => {
  const {
    nome, nacionalidade, rg, cpf, endereco, numero, bairro, cidade, estado,
    atividade, data_inicio, rendimento_mensal, pdf_url
  } = req.body;

  // Salvar no banco de dados
  db.run(`INSERT INTO documentos (nome, nacionalidade, rg, cpf, endereco, numero, bairro, cidade, estado, atividade, data_inicio, rendimento_mensal, pdf_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nome, nacionalidade, rg, cpf, endereco, numero, bairro, cidade, estado,
      atividade, data_inicio, rendimento_mensal, pdf_url, req.session.userId
    ],
    function(err) {
      if (err) {
        console.error('Erro ao salvar no banco:', err);
        res.status(500).send('Erro ao salvar no banco de dados');
      } else {
        res.send('Declaração de trabalhador autônomo salva com sucesso!');
      }
    }
  );
});


// Rota para a página de histórico
app.get('/historico', isAuthenticated, (req, res) => {
  const userId = req.session.userId;

  connection.query('SELECT * FROM documentos WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
      if (err) {
          console.error('Erro ao buscar histórico:', err);
          return res.status(500).send('Erro ao buscar histórico');
      }

      res.render('historico', { historico: rows }); // Passando o histórico para o template
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const path = require('path'); // Importar o módulo path

const app = express();
const port = 3000;

// Configuração da conexão com o MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ab45.bu@1',
    database: 'cartorio',
    port: 3306
});

// Conectar ao MySQL
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Middleware para processar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({
    secret: 'segredo',
    resave: true,
    saveUninitialized: true
}));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos da pasta public

// Rota para a página inicial que redireciona para a página de login
app.get('/', (req, res) => {
    res.redirect('/login'); // Redireciona para a página de login
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // Enviar o arquivo HTML da página de login
});

// Rota para a página inicial (home)
app.get('/home', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'home.html')); // Enviar o arquivo HTML da página inicial
});

// Rota para a página de autorização
app.get('/autorizacao', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'autorizacao.html')); // Enviar o arquivo HTML da página de autorização
});

// Rota para a página de declaração de residência
app.get('/residencia', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'residencia.html')); // Enviar o arquivo HTML da página de declaração
});

// Rota para processar o login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verificar se o usuário existe no banco de dados
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            res.status(500).send('Erro interno ao fazer login');
            return;
        }

        // Verificar se o usuário foi encontrado e se a senha está correta
        if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
            res.status(401).send('Usuário ou senha inválidos');
            return;
        }

        // Armazenar o ID do usuário na sessão
        req.session.userId = results[0].id;
        res.redirect('/home'); // Redireciona para a página inicial após login
    });
});

// Rota para a página de criação de conta
app.get('/criar-conta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'criar-conta.html')); // Enviar o arquivo HTML da página de criação de conta
});

// Rota para processar a criação de conta
app.post('/criar-conta', (req, res) => {
    const { username, password, email } = req.body;

    // Hash a senha antes de armazená-la
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Armazenar o novo usuário no banco de dados
    connection.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err, results) => {
        if (err) {
            console.error('Erro ao criar conta:', err);
            return res.status(500).send('Erro interno ao criar conta');
        }

        // Redireciona de volta para a página de login após criar a conta
        res.redirect('/login');
    });
});

// Rota para a página de autorização para hospedagem
app.get('/hospedagem', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'hospedagem.html')); // Enviar o arquivo HTML da página de autorização para hospedagem
});

// Rota para a página de declaração de trabalho autônomo
app.get('/trabalho_autonomo', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'trabalho_autonomo.html')); // Enviar o arquivo HTML da página de declaração de trabalho autônomo
});

// Rota para a página de termo de quitacao
app.get('/termo_quitacao', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'termo_quitacao.html')); // Enviar o arquivo HTML da página de declaração de trabalho autônomo
});

// Rota para a página de recibo de pagamento
app.get('/recibo_pagamento', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'recibo_pagamento.html')); // Enviar o arquivo HTML da página de declaração de trabalho autônomo
});

// Rota para a página dunião estavel
app.get('/uniao_estavel', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'uniao_estavel.html')); // Enviar o arquivo HTML da página de declaração de trabalho autônomo
});

// Rota para a autorização com acompanhante
app.get('/autorizacao_acomp', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'autorizacao_acomp.html')); // Enviar o arquivo HTML da página de declaração de trabalho autônomo
});

// Rota para auto declaração de residencia
app.get('/auto_residencia', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver autenticado
    }
    res.sendFile(path.join(__dirname, 'public', 'auto_residencia.html')); // Enviar o arquivo HTML da página de declaração de trabalho autônomo
});




// Define o diretório onde os templates estão localizados
app.set('views', path.join(__dirname, 'views'));

// Define o motor de template a ser usado
app.set('view engine', 'ejs');

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ab45.bu@1',
    database: 'cartorio',
    port: 3306 // Confirme que a porta está correta
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

module.exports = connection;

const connection = require('./database');
const bcrypt = require('bcryptjs');

// Atualiza a tabela 'users' para incluir telefone e gênero, se ainda não existirem
const alterTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        gender ENUM('Feminino', 'Masculino', 'Prefiro não dizer') DEFAULT 'Prefiro não dizer'
    );
`;

// Verifica se a conexão foi bem importada
if (connection) {
    // Executa a consulta SQL para criar/atualizar a tabela
    connection.query(alterTableQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar/alterar tabela "users":', err.message);
            connection.end();
            return;
        }
        console.log('Tabela "users" criada ou atualizada com sucesso.');

        // Insere um usuário padrão, se necessário
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('admin123', salt);
        const insertUserQuery = `
            INSERT INTO users (username, password, email, phone, gender)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE username=username; -- Garante que o usuário não será duplicado
        `;
        connection.query(insertUserQuery, ['admin', hash, 'admin@example.com', '1234567890', 'Masculino'], (err, result) => {
            if (err) {
                console.error('Erro ao inserir usuário "admin":', err.message);
                connection.end();
                return;
            }
            console.log('Usuário "admin" criado ou já existe.');

            // Encerra a conexão após todas as operações
            connection.end();
        });
    });
} else {
    console.error('Erro ao importar a conexão com o banco de dados.');
}

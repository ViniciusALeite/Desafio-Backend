require('express-async-errors');
const express = require('express');
const routes = require('./routes');
const migrations = require('./database/sqlite/migrations');

const AppError = require('./utils/AppError');

// migrations();

const app = express();
app.use(express.json());

app.use(routes);

app.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});

const PORT = 80;
app.listen(PORT, () => {
    console.clear();
    console.log(`Servidor rodando na porta ${PORT}`)
});
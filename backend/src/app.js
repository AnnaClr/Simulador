const express = require('express');
const cors = require('cors');
const simuladorRoutes = require('./routes/routes');

const app = express();

app.use(
    cors({
        origin: (origin, callback) => callback(null, true),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
    })
);

app.use((req, res, next) => {
    console.log(`📨 [${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    if (req.headers.origin) {
        console.log(`🌐 Origin: ${req.headers.origin}`);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/simulador', simuladorRoutes);

app.get('/health', (req, res) => {
    console.log('/health endpoint acessado');
    res.json({ 
        status: 'OK', 
        message: 'Backend está funcionando!',
        timestamp: new Date().toISOString(),
        cors: 'Enabled'
    });
});

app.get('/', (req, res) => {
    console.log('📡 Rota inicial acessada');
    res.json({ 
        message: 'API do Simulador Hub Caju Embrapa',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            implantacao: {
                get: '/api/simulador/implantacao',
                post: '/api/simulador/implantacao'
            },
            substituicao: {
                get: '/api/simulador/substituicao',
                post: '/api/simulador/substituicao'
            }
        }
    });
});

app.use((error, req, res, next) => {
    console.error(`Erro interno: ${error.message}`);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
    });
});

module.exports = app;

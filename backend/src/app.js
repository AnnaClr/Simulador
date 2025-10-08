const express = require('express');
const cors = require('cors');
const simuladorRoutes = require('./routes/routes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/simulador', simuladorRoutes);

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend está funcionando!',
        timestamp: new Date().toISOString(),
        cors: 'Enabled'
    });
});

app.get('/', (req, res) => {
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
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
    });
});

app.options('*', cors());

module.exports = app;
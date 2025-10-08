const app = require('./src/app');

const PORT = process.env.PORT || 3000;

console.log('Iniciando o servidor...');
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

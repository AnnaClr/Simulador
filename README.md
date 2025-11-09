# 🌰 Simulador Hub Caju Embrapa

O **Simulador Hub Caju Embrapa** é uma aplicação interativa desenvolvida para processar e visualizar dados de simulações agrícolas baseadas em planilhas da Embrapa.  
O sistema integra um **backend em Node.js** para leitura e tratamento de arquivos `.xlsx`, com um **frontend em React + Vite + TailwindCSS**, oferecendo uma interface moderna e responsiva.

---

## 🌐 Tecnologias Utilizadas

### 🎨 Frontend
- **React 19** — Biblioteca para criação de interfaces dinâmicas  
- **Vite 6** — Ferramenta de build rápida e moderna  
- **TailwindCSS 4** — Framework utilitário para estilização  
- **React Router DOM 7** — Gerenciamento de rotas no SPA  
- **Chart.js + React ChartJS 2** — Gráficos interativos e responsivos  
- **FontAwesome** — Ícones SVG personalizáveis  

### ⚙️ Backend
- **Node.js + Express 5** — Servidor web e roteamento de APIs  
- **XLSX** — Leitura e processamento de planilhas Excel  
- **CORS e Dotenv** — Configuração de ambiente e segurança  

---

## 🏗️ Arquitetura do Projeto

A aplicação é dividida em duas partes principais: **frontend** e **backend**, com separação clara entre camadas de apresentação, lógica e dados.

---

## 🏗️ Estrutura de Diretórios

```bash
SIMULADOR
├── backend
│   ├── data/
│   │   ├── implantacaojeiroanoosimulacao.xlsx
│   │   └── substituicaodecopasimulacao.xlsx
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── Cards/
│   │   │   ├── Charts/
│   │   │   └── tables/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── first-simulation/
│   │   │   └── second-simulation/
│   │   ├── services/
│   │   │   └── util/
│   │   │       ├── simulationData1.js
│   │   │       └── simulationData2.js
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── style.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   └── .gitignore
``` 

---

## 🧱 Estrutura Modular por Responsabilidade

### 🎨 Frontend
Organizado por **domínio visual e funcional**, aproximando-se das abordagens *Atomic Design* e *Feature-based Architecture*.

- **Camada de Apresentação:** `pages/` e `components/`  
- **Lógica de Negócio:** `services/util/`  
- **Estilo e Layout:** `styles/`

Essa estrutura facilita escalabilidade, manutenção e colaboração entre desenvolvedores.

### 🛠️ Backend
Segue o padrão **MVC simplificado**, com foco na leitura e processamento de dados das planilhas Excel e exposição via API RESTful.

---

## 🚀 Guia de Instalação

### 🧩 1. Pré-requisitos

Certifique-se de ter instalado:

```bash
[Node.js](https://nodejs.org/) (versão **18** ou superior)
[npm](https://www.npmjs.com/) (instalado junto com o Node)
``` 

### 📦 2. Clonar o Repositório

```bash
git clone https://github.com/AnnaClr/Simulador
cd Simulador
``` 

### ⚙️ 3. Instalar Dependências
🔸 Backend
```bash
cd backend
npm install
```

🔹 Frontend

Em outro terminal:
```bash
cd frontend
npm install
``` 

### ▶️ 4. Executar o Projeto
🖥️ Backend

Na pasta backend, execute:
```bash
npm start
```
ou para Linux:

```bash
node server.js
```

O servidor será iniciado em:
```bash
http://localhost:3000
``` 

Endpoints disponíveis:
```bash
GET http://localhost:3000/api/simulador/substituicao → dados da tabela substituicaodecopasimulacao
GET http://localhost:3000/api/simulador/implantacao → dados da tabela implantacaocajueiroanaosimulacao
``` 

💻 Frontend

Na pasta frontend, execute:
```bash
npm run dev
``` 

A aplicação abrirá automaticamente em:
```bash
http://localhost:5173
``` 

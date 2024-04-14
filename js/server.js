const http = require('http');
const fs = require('fs');
const path = require('path');

// Função para servir páginas HTML, CSS, ou outros tipos de arquivos
function serveFile(req, res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading file');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Função para determinar o tipo de conteúdo com base na extensão do arquivo
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        default:
            return 'text/plain';
    }
}

// Função para servir a página HTML com o mapa ou o arquivo CSS
function serveMapPage(req, res) {
    let filePath;
    if (req.url === '/map') {
        filePath = path.join(__dirname, '../index.html');
    } else if (req.url === '/index.css') {
        filePath = path.join(__dirname, '../index.css');
    } else {
        res.writeHead(404);
        res.end('Page not found');
        return;
    }
    const contentType = getContentType(filePath);
    serveFile(req, res, filePath, contentType);
}

// Cria o servidor e define a rota para servir a página do mapa ou arquivos CSS
const server = http.createServer((req, res) => {
    if (req.url === '/map' || req.url === '/index.css') {
        serveMapPage(req, res);
    } else {
        res.writeHead(404);
        res.end('Page not found');
    }
});

// Define a porta em que o servidor irá escutar
const PORT = process.env.PORT || 3000;

// Inicia o servidor
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

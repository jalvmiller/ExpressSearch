const fs = require('fs');

function registrarErro(mensagem, error) {
    console.error(`${mensagem} ${error.message}`);
    const log = `[${new Date().toISOString()}] ERRO: ${error.message}\nStack: ${error.stack}\n\n\n`;
    fs.appendFileSync('error.log', log);
}

module.exports = { registrarErro };
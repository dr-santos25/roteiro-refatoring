const { readFileSync } = require('fs');

// ... (todas as funções auxiliares do Passo 5 ficam aqui, exatamente iguais) ...
// (Para não repetir, mantenha as funções getPeca, calcular..., formatarMoeda do Passo 5)

function gerarFaturaStr(fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        let total = calcularTotalApresentacao(pecas, apre);
        faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

// NOVA FUNÇÃO EM HTML (PASSO 6)
function gerarFaturaHTML(fatura, pecas) {
    let html = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
        let total = calcularTotalApresentacao(pecas, apre);
        html += `<li>  ${getPeca(pecas, apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
    }
    html += `</ul>\n`;
    html += `<p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`;
    html += `<p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n`;
    html += `</html>`;
    return html;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

console.log(gerarFaturaStr(faturas, pecas));
console.log(gerarFaturaHTML(faturas, pecas)); // NOVA CHAMADA
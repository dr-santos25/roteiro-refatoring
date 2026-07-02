const { readFileSync } = require('fs');

// CLASSE REPOSITORIO (PASSO 8)
class Repositorio {
    constructor() {
        this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }

    getPeca(apre) {
        return this.pecas[apre.id];
    }
}

// CLASSE DE SERVIÇO (MODIFICADA)
class ServicoCalculoFatura {
    constructor(repo) {
        this.repo = repo; // RECEBE O REPOSITORIO
    }

    calcularTotalApresentacao(apre) { // REMOVIDO `pecas`
        const peca = this.repo.getPeca(apre); // USA O REPO
        let total = 0;
        switch (peca.tipo) {
        case "tragedia":
            total = 40000;
            if (apre.audiencia > 30) {
                total += 1000 * (apre.audiencia - 30);
            }
            break;
        case "comedia":
            total = 30000;
            if (apre.audiencia > 20) {
                total += 10000 + 500 * (apre.audiencia - 20);
            }
            total += 300 * apre.audiencia;
            break;
        default:
            throw new Error(`Peça desconhecia: ${peca.tipo}`);
        }
        return total;
    }

    calcularCredito(apre) { // REMOVIDO `pecas`
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        if (this.repo.getPeca(apre).tipo === "comedia") 
            creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    calcularTotalFatura(apresentacoes) { // REMOVIDO `pecas`
        let total = 0;
        for (let apre of apresentacoes) {
            total += this.calcularTotalApresentacao(apre);
        }
        return total;
    }

    calcularTotalCreditos(apresentacoes) { // REMOVIDO `pecas`
        let totalCreditos = 0;
        for (let apre of apresentacoes) {
            totalCreditos += this.calcularCredito(apre);
        }
        return totalCreditos;
    }
}

// FUNÇÃO AUXILIAR DE FORMATAÇÃO (MOEDA)
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency", currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}

// FUNÇÕES DE APRESENTAÇÃO (AGORA SÓ RECEBEM fatura e calc)
function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        let total = calc.calcularTotalApresentacao(apre);
        // PEGA O NOME VIA calc.repo
        faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, calc) {
    let html = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
        let total = calc.calcularTotalApresentacao(apre);
        html += `<li>  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
    }
    html += `</ul>\n`;
    html += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))} </p>\n`;
    html += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} </p>\n`;
    html += `</html>`;
    return html;
}

// PROGRAMA PRINCIPAL
const faturas = JSON.parse(readFileSync('./faturas.json'));
// NÃO PRECISAMOS MAIS LER pecas.json AQUI

const calc = new ServicoCalculoFatura(new Repositorio()); // INJETA O REPO

console.log(gerarFaturaStr(faturas, calc));
// console.log(gerarFaturaHTML(faturas, calc));
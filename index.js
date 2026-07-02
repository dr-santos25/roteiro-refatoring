const { readFileSync } = require('fs');

// FUNÇÕES MOVIDAS PARA FORA (PASSO 5)
function getPeca(pecas, apre) {
    return pecas[apre.id];
}

function calcularTotalApresentacao(pecas, apre) {
    const peca = getPeca(pecas, apre);
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

function calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia") 
        creditos += Math.floor(apre.audiencia / 5);
    return creditos;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency", currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}

function calcularTotalFatura(pecas, apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
        total += calcularTotalApresentacao(pecas, apre);
    }
    return total;
}

function calcularTotalCreditos(pecas, apresentacoes) {
    let totalCreditos = 0;
    for (let apre of apresentacoes) {
        totalCreditos += calcularCredito(pecas, apre);
    }
    return totalCreditos;
}

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

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
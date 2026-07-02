const { readFileSync } = require('fs');

class ServicoCalculoFatura {
    calcularTotalApresentacao(pecas, apre) {
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

    calcularCredito(pecas, apre) {
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        if (getPeca(pecas, apre).tipo === "comedia") 
            creditos += Math.floor(apre.audiencia / 5);
        return creditos;
    }

    calcularTotalFatura(pecas, apresentacoes) {
        let total = 0;
        for (let apre of apresentacoes) {
            total += this.calcularTotalApresentacao(pecas, apre);
        }
        return total;
    }

    calcularTotalCreditos(pecas, apresentacoes) {
        let totalCreditos = 0;
        for (let apre of apresentacoes) {
            totalCreditos += this.calcularCredito(pecas, apre);
        }
        return totalCreditos;
    }
}

function getPeca(pecas, apre) {
    return pecas[apre.id];
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency", currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}

function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    // Leitura temporária do pecas.json (será removida no passo 8)
    const pecas = JSON.parse(readFileSync('./pecas.json'));
    for (let apre of fatura.apresentacoes) {
        let total = calc.calcularTotalApresentacao(pecas, apre);
        faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, calc) {
    const pecas = JSON.parse(readFileSync('./pecas.json'));
    let html = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
        let total = calc.calcularTotalApresentacao(pecas, apre);
        html += `<li>  ${getPeca(pecas, apre).nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
    }
    html += `</ul>\n`;
    html += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`;
    html += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>\n`;
    html += `</html>`;
    return html;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura();

console.log(gerarFaturaStr(faturas, calc));
// console.log(gerarFaturaHTML(faturas, calc)); // opcional
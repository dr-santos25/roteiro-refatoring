const { readFileSync } = require('fs');

const Repositorio = require("./repositorio.js");
const ServicoCalculoFatura = require("./servico.js");
const { gerarFaturaStr } = require("./apresentacao.js"); // só texto

const faturas = JSON.parse(readFileSync('./faturas.json'));

const calc = new ServicoCalculoFatura(new Repositorio());

console.log(gerarFaturaStr(faturas, calc));
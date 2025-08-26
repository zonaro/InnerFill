// Funções geradoras extraídas de background.js
// Todas as funções gerarXXX, mascaraXXX, rand, etc.

function rand(n) { return Math.floor(Math.random() * n); }

function gerarNome() {
    const nomes = ["Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gabriel", "Helena", "Igor", "Juliana", "Lucas", "Mariana", "Nicolas", "Olivia", "Paulo", "Rafaela", "Samuel", "Tatiane", "Vinicius", "Yasmin"];
    return nomes[rand(nomes.length)];
}

function gerarSobrenome() {
    const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida", "Costa", "Gomes", "Martins", "Araujo", "Barbosa", "Cardoso", "Dias", "Freitas", "Moura", "Pereira", "Ribeiro", "Teixeira", "Vieira"];
    return sobrenomes[rand(sobrenomes.length)];
}

function gerarNomeCompleto() { return gerarNome() + " " + gerarSobrenome(); }

function gerarEmail() {
    const nomes = ["ana", "bruno", "carlos", "daniela", "eduardo", "fernanda", "gabriel", "helena", "igor", "juliana", "lucas", "mariana", "nicolas", "olivia", "paulo", "rafaela", "samuel", "tatiane", "vinicius", "yasmin"];
    const doms = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "uol.com.br", "bol.com.br", "terra.com.br"];
    return nomes[rand(nomes.length)] + rand(100) + "@" + doms[rand(doms.length)];
}

function gerarCPF() {
    let n = [];
    for (let i = 0; i < 9; ++i) n.push(rand(10));
    let d1 = 0, d2 = 0;
    for (let i = 0; i < 9; ++i) d1 += n[i] * (10 - i);
    d1 = 11 - (d1 % 11); if (d1 >= 10) d1 = 0;
    for (let i = 0; i < 9; ++i) d2 += n[i] * (11 - i);
    d2 += d1 * 2;
    d2 = 11 - (d2 % 11); if (d2 >= 10) d2 = 0;
    return `${n.join("")}${d1}${d2}`;
}

function mascaraCPF(cpf) { return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); }

function gerarCNPJ() {
    let n = [];
    for (let i = 0; i < 12; ++i) n.push(rand(10));
    let d1 = 0, d2 = 0, m1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], m2 = [6].concat(m1);
    for (let i = 0; i < 12; ++i) d1 += n[i] * m1[i];
    d1 = 11 - (d1 % 11); if (d1 >= 10) d1 = 0;
    for (let i = 0; i < 12; ++i) d2 += n[i] * m2[i];
    d2 += d1 * 2;
    d2 = 11 - (d2 % 11); if (d2 >= 10) d2 = 0;
    return `${n.join("")}${d1}${d2}`;
}

function mascaraCNPJ(cnpj) { return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"); }

function gerarRG() {
    let n = [];
    for (let i = 0; i < 8; ++i) n.push(rand(10));
    return `${n.join("")}${rand(10)}`;
}

function gerarCNH() {
    let n = [];
    for (let i = 0; i < 9; ++i) n.push(rand(10));
    return n.join("");
}

function gerarTelefone() {
    return '9' + String(rand(100000000)).padStart(8, '0');
}

function gerarTelefoneDDD(brasilCache) {
    if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "(00) 00000000";
    const cidade = brasilCache[rand(brasilCache.length)];
    return `(${cidade.DDD}) ${gerarTelefone()}`;
}

function gerarCidade(brasilCache) {
    if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "Cidade";
    return brasilCache[rand(brasilCache.length)].Nome;
}

function gerarEstado(brasilCache) {
    const estados = { 12: 'AC', 27: 'AL', 13: 'AM', 16: 'AP', 29: 'BA', 23: 'CE', 53: 'DF', 32: 'ES', 52: 'GO', 21: 'MA', 31: 'MG', 50: 'MS', 51: 'MT', 15: 'PA', 25: 'PB', 26: 'PE', 22: 'PI', 41: 'PR', 33: 'RJ', 24: 'RN', 43: 'RS', 11: 'RO', 14: 'RR', 42: 'SC', 28: 'SE', 35: 'SP', 17: 'TO' };
    if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "UF";
    const cidade = brasilCache[rand(brasilCache.length)];
    const ibge = cidade.IBGE.toString().padStart(7, '0');
    const uf = estados[parseInt(ibge.substring(0, 2))] || "UF";
    return uf;
}

function gerarBairro() {
    const bairros = ["Centro", "Jardim das Flores", "Vila Nova", "Bela Vista", "Santo Antônio", "Industrial", "Boa Vista", "São José", "Santa Maria", "Vila Rica"];
    return bairros[rand(bairros.length)];
}

function gerarLogradouro() {
    const tipos = ["Rua", "Avenida", "Travessa", "Alameda", "Praça", "Estrada", "Rodovia"];
    const nomes = ["das Flores", "Paulista", "dos Andradas", "da Liberdade", "XV de Novembro", "da Paz", "dos Pinheiros", "da Independência", "das Palmeiras", "da República"];
    return tipos[rand(tipos.length)] + " " + nomes[rand(nomes.length)];
}

function gerarEnderecoCompleto(brasilCache) {
    return gerarLogradouro() + ", " + (rand(999) + 1) + " - " + gerarBairro() + ", " + gerarCidade(brasilCache) + " - " + gerarEstado(brasilCache) + ", " + gerarCEP();
}

function gerarCEP() {
    let n = [];
    for (let i = 0; i < 8; ++i) n.push(rand(10));
    return `${n[0]}${n[1]}${n[2]}${n[3]}${n[4]}-${n[5]}${n[6]}${n[7]}`;
}

function mascaraCEP(cep) { return cep.replace(/(\d{5})(\d{3})/, "$1-$2"); }

function gerarCartaoCredito() {
    const prefixos = ["4", "5"];
    let num = prefixos[rand(prefixos.length)];
    for (let i = 0; i < 14; ++i) num += rand(10);
    function luhn(s) {
        let sum = 0, alt = false;
        for (let i = s.length - 1; i >= 0; i--) {
            let n = parseInt(s[i]);
            if (alt) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alt = !alt;
        }
        return (10 - (sum % 10)) % 10;
    }
    num += luhn(num);
    return num;
}

function mascaraCartaoCredito(cc) {
    return cc.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function gerarSenhaForte() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    let s = "";
    for (let i = 0; i < 12; ++i) s += chars[rand(chars.length)];
    return s;
}

function gerarDataAleatoria() {
    const start = new Date(1970, 0, 1).getTime();
    const end = new Date().getTime();
    const d = new Date(start + Math.random() * (end - start));
    return d.toISOString().slice(0, 10);
}

function gerarDataAleatoria18() {
    const end = new Date();
    end.setFullYear(end.getFullYear() - 18);
    const start = new Date(1970, 0, 1).getTime();
    const d = new Date(start + Math.random() * (end.getTime() - start));
    return d.toISOString().slice(0, 10);
}

function gerarNumero9999() { return `${rand(10000)}`; }
function gerarNumero10() { return `${rand(10)}`; }
function gerarNumero100() { return `${rand(100)}`; }
function gerarNumero1000() { return `${rand(1000)}`; }

function gerarCorHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function gerarIBGE() {
    return String(rand(9999999)).padStart(7, '0');
}

// Exporta todas as funções para uso via import ES6

// Exporta para ES6 e também para window.geradores (uso global em scripts injetados)
export {
    gerarBairro, gerarCartaoCredito, gerarCEP, gerarCidade, gerarCNH, gerarCNPJ, gerarCorHex, gerarCPF, gerarDataAleatoria,
    gerarDataAleatoria18, gerarEmail, gerarEnderecoCompleto, gerarEstado, gerarIBGE, gerarLogradouro, gerarNome, gerarNomeCompleto, gerarNumero10,
    gerarNumero100,
    gerarNumero1000, gerarNumero9999, gerarRG, gerarSenhaForte, gerarSobrenome, gerarTelefone,
    gerarTelefoneDDD, mascaraCartaoCredito, mascaraCEP, mascaraCNPJ, mascaraCPF, rand
};

if (typeof window !== "undefined") {
    window.geradores = {
        gerarBairro, gerarCartaoCredito, gerarCEP, gerarCidade, gerarCNH, gerarCNPJ, gerarCorHex, gerarCPF, gerarDataAleatoria,
        gerarDataAleatoria18, gerarEmail, gerarEnderecoCompleto, gerarEstado, gerarIBGE, gerarLogradouro, gerarNome, gerarNomeCompleto, gerarNumero10,
        gerarNumero100, gerarNumero1000, gerarNumero9999, gerarRG, gerarSenhaForte, gerarSobrenome, gerarTelefone,
        gerarTelefoneDDD, mascaraCartaoCredito, mascaraCEP, mascaraCNPJ, mascaraCPF, rand
    };
}


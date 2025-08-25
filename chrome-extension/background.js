chrome.contextMenus.create({
    id: "preencher-formulario-completo",
    parentId: "gerar-dados",
    title: "Preencher formulário completo",
    contexts: ["editable"]
});
// Variável global para cache dos dados do Brasil
let brasilCache = [];

// Carregar brasil.json ao iniciar
fetch(chrome.runtime.getURL('brasil.json'))
    .then(resp => resp.json())
    .then(json => { brasilCache = json; });

// Criação do menu de contexto
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "gerar-dados",
        title: "Gerar...",
        contexts: ["editable"]
    });

    // Submenus
    chrome.contextMenus.create({
        id: "submenu-pessoal",
        parentId: "gerar-dados",
        title: "Informações Pessoais",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "submenu-endereco",
        parentId: "gerar-dados",
        title: "Endereço",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "submenu-numeros",
        parentId: "gerar-dados",
        title: "Números",
        contexts: ["editable"]
    });
    chrome.contextMenus.create({
        id: "submenu-datas",
        parentId: "gerar-dados",
        title: "Datas",
        contexts: ["editable"]
    });

    // Informações Pessoais
    [
        { id: "nome", title: "Nome" },
        { id: "nome-completo", title: "Nome Completo" },
        { id: "cnpj", title: "CNPJ (sem máscara)" },
        { id: "cnpj-mascara", title: "CNPJ (com máscara)" },
        { id: "cpf", title: "CPF (sem máscara)" },
        { id: "cpf-mascara", title: "CPF (com máscara)" },
        { id: "rg", title: "RG" },
        { id: "cnh", title: "CNH" },
        { id: "telefone", title: "Telefone (sem máscara)" },
        { id: "telefone-mascara", title: "Telefone (com máscara)" },
        { id: "telefone-ddd", title: "Telefone + DDD (sem máscara)" },
        { id: "telefone-ddd-mascara", title: "Telefone + DDD (com máscara)" },
        { id: "email", title: "Email" },
        { id: "senha-forte", title: "Senha Forte" }
    ].forEach(opt => {
        chrome.contextMenus.create({
            id: opt.id,
            parentId: "submenu-pessoal",
            title: opt.title,
            contexts: ["editable"]
        });
    });

    // Endereço
    [
        { id: "endereco-completo", title: "Endereço Completo" },
        { id: "logradouro", title: "Logradouro" },
        { id: "bairro", title: "Bairro" },
        { id: "cidade", title: "Cidade" },
        { id: "estado", title: "Estado" },
        { id: "ibge", title: "IBGE" },
        { id: "cep", title: "CEP (sem máscara)" },
        { id: "cep-mascara", title: "CEP (com máscara)" }
    ].forEach(opt => {
        chrome.contextMenus.create({
            id: opt.id,
            parentId: "submenu-endereco",
            title: opt.title,
            contexts: ["editable"]
        });
    });

    // Números
    [
        { id: "numero-9999", title: "Número (entre 0 e 9999)" },
        { id: "numero-10", title: "Número < 10" },
        { id: "numero-100", title: "Número < 100" },
        { id: "numero-1000", title: "Número < 1000" },
        { id: "cor-hex", title: "Cor Hexadecimal" }
    ].forEach(opt => {
        chrome.contextMenus.create({
            id: opt.id,
            parentId: "submenu-numeros",
            title: opt.title,
            contexts: ["editable"]
        });
    });

    // Datas
    [
        { id: "data-aleatoria", title: "Data Aleatória" },
        { id: "data-aleatoria-18", title: "Data Aleatória (maior de 18 anos)" }
    ].forEach(opt => {
        chrome.contextMenus.create({
            id: opt.id,
            parentId: "submenu-datas",
            title: opt.title,
            contexts: ["editable"]
        });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith("sep")) return;
    if (info.menuItemId === "preencher-formulario-completo") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: preencherFormularioCompleto,
            args: [brasilCache]
        });
    } else {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: gerarValorNoInput,
            args: [info.menuItemId, brasilCache]
        });
    }
    // Função para preencher formulário completo
    function preencherFormularioCompleto(brasilCache) {
        // Funções geradoras (as mesmas de gerarValorNoInput)
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
        function gerarTelefone() { return '9' + String(rand(100000000)).padStart(8, '0'); }
        function mascaraTelefone(tel) { return tel.replace(/(\d{5})(\d{4})/, "$1-$2"); }
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
        function gerarCEP() {
            let n = [];
            for (let i = 0; i < 8; ++i) n.push(rand(10));
            return `${n[0]}${n[1]}${n[2]}${n[3]}${n[4]}-${n[5]}${n[6]}${n[7]}`;
        }
        function gerarCidade() {
            if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "Cidade";
            return brasilCache[rand(brasilCache.length)].Nome;
        }
        function gerarEstado() {
            if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "UF";
            const estados = { 12: 'AC', 27: 'AL', 13: 'AM', 16: 'AP', 29: 'BA', 23: 'CE', 53: 'DF', 32: 'ES', 52: 'GO', 21: 'MA', 31: 'MG', 50: 'MS', 51: 'MT', 15: 'PA', 25: 'PB', 26: 'PE', 22: 'PI', 41: 'PR', 33: 'RJ', 24: 'RN', 43: 'RS', 11: 'RO', 14: 'RR', 42: 'SC', 28: 'SE', 35: 'SP', 17: 'TO' };
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
        function gerarEnderecoCompleto() {
            return gerarLogradouro() + ", " + (rand(999) + 1) + " - " + gerarBairro() + ", " + gerarCidade() + " - " + gerarEstado() + ", " + gerarCEP();
        }

        // Mapeamento de campos (normalização)
        function normalizar(str) {
            return (str || "").toLowerCase().replace(/[^a-z0-9]/gi, "");
        }
        // Chaves possíveis para cada tipo de campo
        const campos = [
            { tipo: "nome-completo", chaves: ["nomecompleto", "fullname", "nomecompleto"] },
            { tipo: "nome", chaves: ["nome", "firstname", "primeironome"] },
            { tipo: "sobrenome", chaves: ["sobrenome", "lastname"] },
            { tipo: "email", chaves: ["email"] },
            { tipo: "cpf", chaves: ["cpf"] },
            { tipo: "cnpj", chaves: ["cnpj"] },
            { tipo: "telefone", chaves: ["telefone", "celular", "phone", "mobile"] },
            { tipo: "senha-forte", chaves: ["senha", "password"] },
            { tipo: "data-aleatoria", chaves: ["data", "date", "nascimento", "birth"] },
            { tipo: "cep", chaves: ["cep", "zipcode", "postalcode"] },
            { tipo: "cidade", chaves: ["cidade", "city"] },
            { tipo: "estado", chaves: ["estado", "uf", "state"] },
            { tipo: "bairro", chaves: ["bairro", "district"] },
            { tipo: "logradouro", chaves: ["logradouro", "endereco", "address", "rua", "street"] },
            { tipo: "endereco-completo", chaves: ["enderecocompleto", "fulladdress"] }
        ];
        // Geradores por tipo
        const geradores = {
            "nome-completo": gerarNomeCompleto,
            "nome": gerarNome,
            "sobrenome": gerarSobrenome,
            "email": gerarEmail,
            "cpf": gerarCPF,
            "cnpj": gerarCNPJ,
            "telefone": () => mascaraTelefone(gerarTelefone()),
            "senha-forte": gerarSenhaForte,
            "data-aleatoria": gerarDataAleatoria,
            "cep": gerarCEP,
            "cidade": gerarCidade,
            "estado": gerarEstado,
            "bairro": gerarBairro,
            "logradouro": gerarLogradouro,
            "endereco-completo": gerarEnderecoCompleto
        };
        // Preencher inputs
        const inputs = Array.from(document.querySelectorAll('input:not([type=hidden]):not([readonly]):not([disabled])'));
        inputs.forEach(input => {
            const props = [input.name, input.id, input.className].map(normalizar).join(' ');
            for (const campo of campos) {
                if (campo.chaves.some(chave => props.includes(chave))) {
                    const valor = geradores[campo.tipo]();
                    input.value = valor;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    break;
                }
            }
        });

        // Preencher selects
        const selects = Array.from(document.querySelectorAll('select:not([readonly]):not([disabled])'));
        selects.forEach(select => {
            const opts = Array.from(select.options).filter(o => o.value && !o.disabled);
            if (opts.length > 0) {
                const opt = opts[rand(opts.length)];
                select.value = opt.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
});

function gerarValorNoInput(tipo, brasilCache) {
    function gerarEmail() {
        const nomes = ["ana", "bruno", "carlos", "daniela", "eduardo", "fernanda", "gabriel", "helena", "igor", "juliana", "lucas", "mariana", "nicolas", "olivia", "paulo", "rafaela", "samuel", "tatiane", "vinicius", "yasmin"];
        const doms = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "uol.com.br", "bol.com.br", "terra.com.br"];
        return nomes[rand(nomes.length)] + rand(100) + "@" + doms[rand(doms.length)];
    }
    function gerarLogradouro() {
        const tipos = ["Rua", "Avenida", "Travessa", "Alameda", "Praça", "Estrada", "Rodovia"];
        const nomes = ["das Flores", "Paulista", "dos Andradas", "da Liberdade", "XV de Novembro", "da Paz", "dos Pinheiros", "da Independência", "das Palmeiras", "da República"];
        return tipos[rand(tipos.length)] + " " + nomes[rand(nomes.length)];
    }
    function gerarBairro() {
        const bairros = ["Centro", "Jardim das Flores", "Vila Nova", "Bela Vista", "Santo Antônio", "Industrial", "Boa Vista", "São José", "Santa Maria", "Vila Rica"];
        return bairros[rand(bairros.length)];
    }
    function gerarEnderecoCompleto() {
        return gerarLogradouro() + ", " + (rand(999) + 1) + " - " + gerarBairro() + ", " + gerarCidade() + " - " + gerarEstado() + ", " + mascaraCEP(gerarCEP());
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
    // Função injetada na página para preencher o input ativo
    // Todas as funções e o map já estão declarados abaixo, não repetir.
    function rand(n) { return Math.floor(Math.random() * n); }
    function gerarNome() {
        const nomes = ["Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gabriel", "Helena", "Igor", "Juliana", "Lucas", "Mariana", "Nicolas", "Olivia", "Paulo", "Rafaela", "Samuel", "Tatiane", "Vinicius", "Yasmin"];
        return nomes[rand(nomes.length)];
    }
    function gerarSobrenome() {
        const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida", "Costa", "Gomes", "Martins", "Araujo", "Barbosa", "Cardoso", "Dias", "Freitas", "Moura", "Pereira", "Ribeiro", "Teixeira", "Vieira"];
        return sobrenomes[rand(sobrenomes.length)];
    }
    function gerarNomeCompleto() {
        return gerarNome() + " " + gerarSobrenome();
    }
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
        // Gera número de celular brasileiro com 9 dígitos, começando com 9 fixo
        return '9' + String(rand(100000000)).padStart(8, '0');
    }
    function gerarTelefoneDDD() {
        if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "(00) 00000000";
        const cidade = brasilCache[rand(brasilCache.length)];
        return `(${cidade.DDD}) ${gerarTelefone()}`;
    }
    function gerarCidade() {
        if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "Cidade";
        return brasilCache[rand(brasilCache.length)].Nome;
    }
    function gerarEstado() {
        if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "UF";
        // Pega a sigla do estado a partir do IBGE (primeiros dígitos)
        const estados = {
            12: 'AC', 27: 'AL', 13: 'AM', 16: 'AP', 29: 'BA', 23: 'CE', 53: 'DF', 32: 'ES', 52: 'GO', 21: 'MA', 31: 'MG', 50: 'MS', 51: 'MT', 15: 'PA', 25: 'PB', 26: 'PE', 22: 'PI', 41: 'PR', 33: 'RJ', 24: 'RN', 43: 'RS', 11: 'RO', 14: 'RR', 42: 'SC', 28: 'SE', 35: 'SP', 17: 'TO'
        };
        const cidade = brasilCache[rand(brasilCache.length)];
        const ibge = cidade.IBGE.toString().padStart(7, '0');
        const uf = estados[parseInt(ibge.substring(0, 2))] || "UF";
        return uf;
    }
    function gerarIBGE() {
        if (!Array.isArray(brasilCache) || brasilCache.length === 0) return "0000000";
        return brasilCache[rand(brasilCache.length)].IBGE;
    }
    function gerarCEP() {
        let n = [];
        for (let i = 0; i < 8; ++i) n.push(rand(10));
        return `${n[0]}${n[1]}${n[2]}${n[3]}${n[4]}-${n[5]}${n[6]}${n[7]}`;
    }
    function gerarCorHex() {
        return `#${rand(256).toString(16).padStart(2, '0')}${rand(256).toString(16).padStart(2, '0')}${rand(256).toString(16).padStart(2, '0')}`;
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
        const start = new Date(1950, 0, 1).getTime();
        const d = new Date(start + Math.random() * (end.getTime() - start));
        return d.toISOString().slice(0, 10);
    }
    function gerarNumero9999() {
        return `${rand(10000)}`;
    }
    function gerarNumero10() {
        return `${rand(10)}`;
    }
    function gerarNumero100() {
        return `${rand(100)}`;
    }
    function gerarNumero1000() {
        return `${rand(1000)}`;
    }
    function gerarSenhaForte() {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
        let s = "";
        for (let i = 0; i < 12; ++i) s += chars[rand(chars.length)];
        return s;
    }
    function mascaraCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    function mascaraCNPJ(cnpj) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    function mascaraCEP(cep) {
        return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    function mascaraTelefone(tel) {
        // Sempre aplica o formato #####-#### para 9 dígitos
        return tel.replace(/(\d{5})(\d{4})/, "$1-$2");
    }
    function mascaraTelefoneDDD(tel) {
        // tel: (XX) NNNNNNNN ou (XX) NNNNNNNNN
        return tel.replace(/\((\d{2})\)\s?(\d{4,5})(\d{4})/, "($1) $2-$3");
    }
    const map = {
        "nome": gerarNome(),
        "nome-completo": gerarNomeCompleto(),
        "cnpj": gerarCNPJ(),
        "cnpj-mascara": mascaraCNPJ(gerarCNPJ()),
        "cpf": gerarCPF(),
        "cpf-mascara": mascaraCPF(gerarCPF()),
        "rg": gerarRG(),
        "cnh": gerarCNH(),
        "telefone": gerarTelefone(),
        "telefone-mascara": mascaraTelefone(gerarTelefone()),
        "telefone-ddd": gerarTelefoneDDD(),
        "telefone-ddd-mascara": mascaraTelefoneDDD(gerarTelefoneDDD()),
        "email": gerarEmail(),
        "endereco-completo": gerarEnderecoCompleto(),
        "logradouro": gerarLogradouro(),
        "bairro": gerarBairro(),
        "cidade": gerarCidade(),
        "estado": gerarEstado(),
        "ibge": gerarIBGE(),
        "cep": gerarCEP().replace("-", ""),
        "cep-mascara": gerarCEP(),
        "cor-hex": gerarCorHex(),
        "data-aleatoria": gerarDataAleatoria(),
        "data-aleatoria-18": gerarDataAleatoria18(),
        "numero-9999": gerarNumero9999(),
        "numero-10": gerarNumero10(),
        "numero-100": gerarNumero100(),
        "numero-1000": gerarNumero1000(),
        "senha-forte": gerarSenhaForte()
    };
    const valor = map[tipo] || "";
    if (document.activeElement && document.activeElement.value !== undefined) {
        document.activeElement.value = valor;
        document.activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // Fim da função gerarValorNoInput
}

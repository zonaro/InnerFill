// Cartão de crédito
chrome.contextMenus.create({
    id: "cartao-credito",
    parentId: "submenu-pessoal",
    title: "Cartão de Crédito (sem máscara)",
    contexts: ["editable"]
});
chrome.contextMenus.create({
    id: "cartao-credito-mascara",
    parentId: "submenu-pessoal",
    title: "Cartão de Crédito (com máscara)",
    contexts: ["editable"]
});
chrome.contextMenus.create({
    id: "preencher-formulario-completo",
    parentId: "gerar-dados",
    title: "Preencher formulário completo",
    contexts: ["editable"]
});
// Variável global para cache dos dados do Brasil
let brasilCache = [];
const estados = {
    12: 'AC', 27: 'AL', 13: 'AM', 16: 'AP', 29: 'BA', 23: 'CE', 53: 'DF', 32: 'ES', 52: 'GO', 21: 'MA', 31: 'MG', 50: 'MS', 51: 'MT', 15: 'PA', 25: 'PB', 26: 'PE', 22: 'PI', 41: 'PR', 33: 'RJ', 24: 'RN', 43: 'RS', 11: 'RO', 14: 'RR', 42: 'SC', 28: 'SE', 35: 'SP', 17: 'TO'
};

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
        // Usa as funções do objeto window.geradores
        const g = window.geradores;
        function normalizar(str) {
            return (str || "").toLowerCase().replace(/[^a-z0-9]/gi, "");
        }
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
        const geradores = {
            "nome-completo": g.gerarNomeCompleto,
            "nome": g.gerarNome,
            "sobrenome": g.gerarSobrenome,
            "email": g.gerarEmail,
            "cpf": g.gerarCPF,
            "cnpj": g.gerarCNPJ,
            "telefone": () => g.mascaraTelefone(g.gerarTelefone()),
            "senha-forte": g.gerarSenhaForte,
            "data-aleatoria": g.gerarDataAleatoria,
            "cep": g.gerarCEP,
            "cidade": () => g.gerarCidade(brasilCache),
            "estado": () => g.gerarEstado(brasilCache),
            "bairro": g.gerarBairro,
            "logradouro": g.gerarLogradouro,
            "endereco-completo": () => g.gerarEnderecoCompleto(brasilCache)
        };
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
        const selects = Array.from(document.querySelectorAll('select:not([readonly]):not([disabled])'));
        selects.forEach(select => {
            const opts = Array.from(select.options).filter(o => o.value && !o.disabled);
            if (opts.length > 0) {
                const opt = opts[g.rand(opts.length)];
                select.value = opt.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
});

function gerarValorNoInput(tipo, brasilCache) {
    // Usa as funções do objeto window.geradores
    const g = window.geradores;
    const map = {
        "nome": g.gerarNome(),
        "nome-completo": g.gerarNomeCompleto(),
        "cnpj": g.gerarCNPJ(),
        "cnpj-mascara": g.mascaraCNPJ(g.gerarCNPJ()),
        "cpf": g.gerarCPF(),
        "cpf-mascara": g.mascaraCPF(g.gerarCPF()),
        "rg": g.gerarRG(),
        "cnh": g.gerarCNH(),
        "telefone": g.gerarTelefone(),
        "telefone-mascara": g.mascaraTelefone(g.gerarTelefone()),
        "telefone-ddd": g.gerarTelefoneDDD(brasilCache),
        "telefone-ddd-mascara": g.mascaraTelefone(g.gerarTelefoneDDD(brasilCache)),
        "email": g.gerarEmail(),
        "endereco-completo": g.gerarEnderecoCompleto(brasilCache),
        "logradouro": g.gerarLogradouro(),
        "bairro": g.gerarBairro(),
        "cidade": g.gerarCidade(brasilCache),
        "estado": g.gerarEstado(brasilCache),
        "ibge": g.gerarIBGE(),
        "cep": g.gerarCEP().replace("-", ""),
        "cep-mascara": g.gerarCEP(),
        "cor-hex": g.gerarCorHex(),
        "data-aleatoria": g.gerarDataAleatoria(),
        "data-aleatoria-18": g.gerarDataAleatoria18(),
        "numero-9999": g.gerarNumero9999(),
        "numero-10": g.gerarNumero10(),
        "numero-100": g.gerarNumero100(),
        "numero-1000": g.gerarNumero1000(),
        "senha-forte": g.gerarSenhaForte(),
        "cartao-credito": g.gerarCartaoCredito(),
        "cartao-credito-mascara": g.mascaraCartaoCredito(g.gerarCartaoCredito())
    };
    const valor = map[tipo] || "";
    if (document.activeElement && document.activeElement.value !== undefined) {
        document.activeElement.value = valor;
        document.activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

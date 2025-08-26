// Carrega brasil.json e armazena em brasilCache
let brasilCache = [];
fetch(chrome.runtime.getURL('brasil.json'))
    .then(r => r.json())
    .then(data => { brasilCache = data; });

// Função para buscar o objeto de menu pelo id
function buscarMenuPorId(menu, id) {
    if (menu.id === id) return menu;
    if (menu.children) {
        for (const child of menu.children) {
            const found = buscarMenuPorId(child, id);
            if (found) return found;
        }
    }
    return null;
}
// Objeto de menus aninhados
const MENU_STRUCTURE = {
    id: "gerar-dados",
    title: "Gerar...",
    contexts: ["editable"],
    children: [
        {
            id: "submenu-pessoal",
            title: "Informações Pessoais",
            children: [
                { id: "nome", title: "Nome", func: "gerarNome" },
                { id: "nome-completo", title: "Nome Completo", func: "gerarNomeCompleto" },
                { id: "cnpj", title: "CNPJ (sem máscara)", func: "gerarCNPJ" },
                { id: "cnpj-mascara", title: "CNPJ (com máscara)", func: "mascaraCNPJ" },
                { id: "cpf", title: "CPF (sem máscara)", func: "gerarCPF" },
                { id: "cpf-mascara", title: "CPF (com máscara)", func: "mascaraCPF" },
                { id: "rg", title: "RG", func: "gerarRG" },
                { id: "cnh", title: "CNH", func: "gerarCNH" },
                { id: "telefone", title: "Telefone (sem máscara)", func: "gerarTelefone" },
                { id: "telefone-mascara", title: "Telefone (com máscara)", func: "mascaraTelefone" },
                { id: "telefone-ddd", title: "Telefone + DDD (sem máscara)", func: "gerarTelefoneDDD" },
                { id: "telefone-ddd-mascara", title: "Telefone + DDD (com máscara)", func: "mascaraTelefone" },
                { id: "email", title: "Email", func: "gerarEmail" },
                { id: "senha-forte", title: "Senha Forte", func: "gerarSenhaForte" },
                { id: "cartao-credito", title: "Cartão de Crédito (sem máscara)", func: "gerarCartaoCredito" },
                { id: "cartao-credito-mascara", title: "Cartão de Crédito (com máscara)", func: "mascaraCartaoCredito" }
            ]
        },
        {
            id: "submenu-endereco",
            title: "Endereço",
            children: [
                { id: "endereco-completo", title: "Endereço Completo", func: "gerarEnderecoCompleto" },
                { id: "logradouro", title: "Logradouro", func: "gerarLogradouro" },
                { id: "bairro", title: "Bairro", func: "gerarBairro" },
                { id: "cidade", title: "Cidade", func: "gerarCidade" },
                { id: "estado", title: "Estado", func: "gerarEstado" },
                { id: "ibge", title: "IBGE", func: "gerarIBGE" },
                { id: "cep", title: "CEP (sem máscara)", func: "gerarCEP" },
                { id: "cep-mascara", title: "CEP (com máscara)", func: "mascaraCEP" }
            ]
        },
        {
            id: "submenu-numeros",
            title: "Números",
            children: [
                { id: "numero-9999", title: "Número (entre 0 e 9999)", func: "gerarNumero9999" },
                { id: "numero-10", title: "Número < 10", func: "gerarNumero10" },
                { id: "numero-100", title: "Número < 100", func: "gerarNumero100" },
                { id: "numero-1000", title: "Número < 1000", func: "gerarNumero1000" },
                { id: "cor-hex", title: "Cor Hexadecimal", func: "gerarCorHex" }
            ]
        },
        {
            id: "submenu-datas",
            title: "Datas",
            children: [
                { id: "data-aleatoria", title: "Data Aleatória", func: "gerarDataAleatoria" },
                { id: "data-aleatoria-18", title: "Data Aleatória (maior de 18 anos)", func: "gerarDataAleatoria18" }
            ]
        },
        {
            id: "preencher-formulario-completo",
            title: "Preencher formulário completo"
        }
    ]
};

// Função recursiva para criar os menus
function criarMenusFromObject(menu, parentId) {
    const { id, title, contexts = ["editable"], children } = menu;
    const menuObj = { id, title, contexts };
    if (parentId) menuObj.parentId = parentId;
    chrome.contextMenus.create(menuObj, function () {
        if (chrome.runtime.lastError) {
            console.warn('Erro ao criar menu:', menuObj.id, chrome.runtime.lastError);
            return;
        }
        if (children && Array.isArray(children)) {
            children.forEach(child => criarMenusFromObject(child, id));
        }
    });
}
function criarMenus() {
    chrome.contextMenus.removeAll(() => {
        criarMenusFromObject(MENU_STRUCTURE);
    });
}

// Criação dos menus deve ser feita apenas dentro do onInstalled
// Variável global para cache dos dados do Brasil
chrome.runtime.onInstalled.addListener(criarMenus);
chrome.runtime.onStartup.addListener(criarMenus);



chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith("sep")) return;

    // Funções que dependem de brasilCache
    const precisaBrasilCache = [
        "gerarCidade", "gerarEstado", "gerarEnderecoCompleto", "gerarTelefoneDDD",
        "preencher-formulario-completo"
    ];
    let menuObj = buscarMenuPorId(MENU_STRUCTURE, info.menuItemId);
    let funcName = menuObj && menuObj.func;
    let precisa = precisaBrasilCache.includes(funcName) || info.menuItemId === "preencher-formulario-completo";

    if (precisa && (!brasilCache || !Array.isArray(brasilCache) || brasilCache.length === 0)) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: function() {
                alert('Aguarde o carregamento dos dados do Brasil antes de usar esta função.');
            }
        });
        return;
    }

    if (info.menuItemId === "preencher-formulario-completo") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: preencherFormularioCompleto,
            args: [brasilCache]
        });
    } else {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: function (tipo, funcName, brasilCache) {
                const g = window.geradores;
                let valor = "";
                if (g && typeof g[funcName] === "function") {
                    if (["gerarCidade", "gerarEstado", "gerarEnderecoCompleto", "gerarTelefoneDDD"].includes(funcName)) {
                        valor = g[funcName](brasilCache);
                    } else if (["mascaraCNPJ"].includes(funcName)) {
                        valor = g.mascaraCNPJ(g.gerarCNPJ());
                    } else if (["mascaraCPF"].includes(funcName)) {
                        valor = g.mascaraCPF(g.gerarCPF());
                    } else if (["mascaraTelefone"].includes(funcName)) {
                        valor = g.mascaraTelefone(g.gerarTelefone());
                    } else if (["mascaraCartaoCredito"].includes(funcName)) {
                        valor = g.mascaraCartaoCredito(g.gerarCartaoCredito());
                    } else if (["mascaraCEP"].includes(funcName)) {
                        valor = g.mascaraCEP(g.gerarCEP());
                    } else {
                        valor = g[funcName]();
                    }
                }
                if (document.activeElement && document.activeElement.value !== undefined) {
                    document.activeElement.value = valor;
                    document.activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                }
            },
            args: [info.menuItemId, funcName, brasilCache]
        });
    }
});



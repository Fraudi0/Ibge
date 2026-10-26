// Aluno(a): Bruno Bernardelli Fraudio

const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const filtroCidade = document.getElementById('filtroCidade')
const resumo = document.getElementById('resumo')

const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'

let listaCidades = []

function carregarEstados() {
    fetch(URL_ESTADOS)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Erro ao buscar os estados')
            }
            return resposta.json()
        })
        .then(estados => {
            console.log(estados)
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>'

            estados.forEach(estado => {
                const opcao = document.createElement('option')
                opcao.value = estado.sigla
                opcao.textContent = estado.nome
                selectEstado.appendChild(opcao)
            })
        })
        .catch(erro => {
            console.log(erro)
            selectEstado.innerHTML = '<option value="">Erro ao carregar os estados</option>'
        })
}

function preencherCidades(cidades) {
    selectCidade.innerHTML = '<option value="">Selecione a cidade</option>'

    cidades.forEach(cidade => {
        const opcao = document.createElement('option')
        opcao.value = cidade.nome
        opcao.textContent = cidade.nome
        selectCidade.appendChild(opcao)
    })
}

selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value
    listaCidades = []
    filtroCidade.value = ''
    filtroCidade.disabled = true
    qtdCidades.innerHTML = ''

    if (uf === '') {
        selectCidade.innerHTML = '<option value="">Escolha um estado primeiro</option>'
        selectCidade.disabled = true
        return
    }

    selectCidade.innerHTML = '<option value="">Carregando...</option>'
    selectCidade.disabled = true

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Erro ao buscar as cidades')
            }
            return resposta.json()
        })
        .then(cidades => {
            listaCidades = cidades
            preencherCidades(listaCidades)

            selectCidade.disabled = false
            filtroCidade.disabled = false

            qtdCidades.innerHTML = `${selectEstado.options[selectEstado.selectedIndex].text} tem <strong>${cidades.length}</strong> cidades`
        })
        .catch(erro => {
            console.log(erro)
            selectCidade.innerHTML = '<option value="">Erro ao carregar as cidades</option>'
        })
})

filtroCidade.addEventListener('input', () => {
    const texto = filtroCidade.value.toLowerCase()

    const filtradas = listaCidades.filter(cidade => cidade.nome.toLowerCase().includes(texto))

    preencherCidades(filtradas)

    if (texto === '') {
        qtdCidades.innerHTML = `${selectEstado.options[selectEstado.selectedIndex].text} tem <strong>${listaCidades.length}</strong> cidades`
    } else {
        qtdCidades.innerHTML = `Mostrando <strong>${filtradas.length}</strong> de ${listaCidades.length} cidades`
    }
})

document.getElementById('formInscricao').addEventListener('submit', (evento) => {
    evento.preventDefault()

    const nome = document.getElementById('nome').value.trim()
    const uf = selectEstado.value
    const cidade = selectCidade.value

    if (uf === '' || cidade === '') {
        resumo.className = 'erro'
        resumo.textContent = 'Escolha o estado e a cidade antes de se inscrever.'
        return
    }

    resumo.className = 'sucesso'
    resumo.textContent = `${nome}, de ${cidade}/${uf}, inscrito com sucesso`
})

carregarEstados()

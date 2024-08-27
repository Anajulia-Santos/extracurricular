// Seleciona todos os botões de inscrição e o formulário
const btnInscrever = document.querySelectorAll('.btn-inscrever');
const formulario = document.querySelector('.formulario');
const listaInscricoes = document.getElementById('lista-inscricoes');

// Armazena o nome do curso selecionado
let cursoSelecionado = "";

// Adiciona evento de clique aos botões de inscrição
btnInscrever.forEach(button => {
    button.addEventListener('click', (event) => {
        cursoSelecionado = event.target.closest('.card').querySelector('h3').innerText; // Armazena o nome do curso

        if (verificarInscricaoConfirmada(cursoSelecionado)) {
            alert('Você já está inscrito e confirmado neste curso.');
        } else {
            formulario.style.display = 'block'; // Exibe o formulário
        }
    });
});

// Função para verificar se o aluno já está confirmado no curso
function verificarInscricaoConfirmada(curso) {
    let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    return inscricoes.some(inscricao => inscricao.curso === curso && inscricao.confirmado);
}

// Submete o formulário e salva a inscrição no localStorage
formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const data = document.getElementById('data').value;

    const inscricao = {
        curso: cursoSelecionado,
        nome: nome,
        email: email,
        data: data,
        confirmado: false // Inicialmente não confirmado
    };

    salvarInscricao(inscricao);
    carregarInscricoes();
    formulario.style.display = 'none'; // Esconde o formulário após inscrição
});

// Função para salvar a inscrição no localStorage
function salvarInscricao(inscricao) {
    let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    inscricoes.push(inscricao);
    localStorage.setItem('inscricoes', JSON.stringify(inscricoes));
}

// Função para carregar as inscrições do aluno
function carregarInscricoes() {
    listaInscricoes.innerHTML = ''; // Limpa a lista atual
    let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    
    inscricoes.forEach(inscricao => {
        let item = document.createElement('li');
        item.textContent = `${inscricao.curso} - ${inscricao.confirmado ? 'Confirmado' : 'Pendente'}`;
        listaInscricoes.appendChild(item);
    });
}



// Função para marcar presença
function marcarPresenca(id, status) {
    let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    inscricoes[id].confirmado = true;
    inscricoes[id].presenca = status;
    localStorage.setItem('inscricoes', JSON.stringify(inscricoes));
    carregarInscricoesProfessor(); // Recarrega a lista após atualização
}

function fecharModal() {
        const modal = document.getElementById('relatorio-modal');
        modal.style.display = 'none';
    }

// Função para abrir o modal de relatório e carregar o relatório salvo
function abrirModalRelatorio(id) {
    const modal = document.getElementById('relatorio-modal');
    const inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    const relatorioTexto = document.getElementById('relatorio-texto');
    
    // Carrega o relatório salvo, se existir
    if (inscricoes[id].relatorio) {
        relatorioTexto.value = inscricoes[id].relatorio;
    } else {
        relatorioTexto.value = ''; // Limpa o campo se não houver relatório salvo
    }
    
    modal.style.display = 'block'; // Abre o modal

    // Salva o relatório ao clicar no botão
    document.getElementById('salvar-relatorio').onclick = () => {
        salvarRelatorio(id);
    };
}

// Função para salvar o relatório
function salvarRelatorio(id) {
    let inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || [];
    const textoRelatorio = document.getElementById('relatorio-texto').value;
    inscricoes[id].relatorio = textoRelatorio; // Adiciona o relatório ao objeto de inscrição
    localStorage.setItem('inscricoes', JSON.stringify(inscricoes)); // Salva novamente no localStorage

    fecharModal(); // Fecha o modal após salvar
}

document.addEventListener('DOMContentLoaded', function() {

    // Função para excluir todos os dados do localStorage
    function excluirTodosOsDados() {
        if (confirm('Você tem certeza que deseja excluir todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.clear(); // Limpa todos os dados do localStorage
            alert('Todos os dados foram excluídos.');
            carregarInscricoesProfessor(); // Recarrega a lista de inscrições após exclusão
        }
    }

    // Associar a função ao botão de excluir
    document.getElementById('excluir-dados').addEventListener('click', excluirTodosOsDados);
});
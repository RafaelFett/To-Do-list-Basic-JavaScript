// Referências
let input = document.querySelector('input[name=tarefa]');
let btn = document.querySelector('#botao');
let lista = document.querySelector('#lista');

// Carrega do localStorage
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

// Salvar no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Renderizar
function renderizarTarefas(){
    lista.innerHTML = '';
    let tarefasOrdenadas = tarefas.slice().sort((a, b) => a.concluida - b.concluida);

    for (let tarefa of tarefasOrdenadas){
        let itemLista = document.createElement('li');
        itemLista.setAttribute('class','list-group-item d-flex justify-content-between align-items-center');

        let textoSpan = document.createElement('span');
        textoSpan.textContent = tarefa.texto;
        if (tarefa.concluida) {
            textoSpan.style.textDecoration = 'line-through';
            textoSpan.style.opacity = '0.6';
        }

        // Botões
        let botoes = document.createElement('div');

        //Botão de Concluir
        let btnConcluir = document.createElement('button');
        btnConcluir.setAttribute('class', 'btn btn-success btn-sm mr-2');
        btnConcluir.innerHTML = '<i class="fas fa-check"></i>';
        btnConcluir.onclick = () => {
            tarefa.concluida = !tarefa.concluida;
            salvarNoLocalStorage();
            renderizarTarefas();
        }

        //botão de excluir
        let btnExcluir = document.createElement('button');
        btnExcluir.setAttribute('class', 'btn btn-danger btn-sm');
        btnExcluir.innerHTML = '<i class="fas fa-trash"></i>';
        btnExcluir.onclick = () => {
            if (confirm("Quer remover essa tarefa?")){
                deletarTarefa(tarefa.texto);
            }
            
        }

        botoes.appendChild(btnConcluir);
        botoes.appendChild(btnExcluir);

        itemLista.appendChild(textoSpan);
        itemLista.appendChild(botoes);
        lista.appendChild(itemLista);
    }
}


//Adicionar com Enter
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Impede comportamento padrão
        btn.click(); // Simula clique no botão
    }
});

// Adicionar tarefa
btn.onclick = function(){
    let novaTarefaTexto = input.value.trim();

    // Adiciona uma nova tarefa na lista de tarefas presente
    if (novaTarefaTexto !== ""){
        tarefas.push({ texto: novaTarefaTexto, concluida: false });
        input.value = '';
        removerSpans();
        salvarNoLocalStorage();
        renderizarTarefas();
    } else { // Mostra que a tarefa é inválida
        removerSpans();
        let card = document.querySelector('.card');
        let span = document.createElement('span');
        span.setAttribute('class','alert alert-warning mt-2 d-block');
        span.textContent = 'Você precisa digitar uma tarefa!';
        card.appendChild(span);
    }   
}

// Deletar tarefa
function deletarTarefa(tarTexto) {
    const index = tarefas.findIndex(t => t.texto === tarTexto);
    if (index !== -1) {
        tarefas.splice(index, 1);
        salvarNoLocalStorage();
        renderizarTarefas();
    }
}


// Remover alertas
function removerSpans(){
    document.querySelectorAll('.alert').forEach(alerta => alerta.remove());
}

// Inicialização
renderizarTarefas();

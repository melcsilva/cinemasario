document.addEventListener('DOMContentLoaded', () => {

    const LIMITE = 2;
    const votos = new Set();
    const listaVotos = document.getElementById('lista-votos');
    const btnFinalizar = document.getElementById('finalizar-voto');
    const cards = document.querySelectorAll('.card-filme');

    // --- Toast ---
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.innerHTML = '<span class="toast-icone"></span><span class="toast-texto"></span>';
    document.body.appendChild(toast);

    let toastTimer;
    function mostrarToast(msg, icone, removido = false) {
        clearTimeout(toastTimer);
        toast.querySelector('.toast-icone').textContent = icone;
        toast.querySelector('.toast-texto').textContent = msg;
        toast.classList.toggle('removido', removido);
        toast.classList.add('visivel');
        toastTimer = setTimeout(() => toast.classList.remove('visivel'), 2800);
    }

    cards.forEach(card => {
        const titulo = card.querySelector('h3').textContent;

        card.addEventListener('click', () => {
            if (votos.has(titulo)) {
                votos.delete(titulo);
                card.classList.remove('selecionado');
                const badge = card.querySelector('.badge-voto');
                if (badge) badge.remove();
                mostrarToast(`"${titulo}" removido dos votos`, '✕', true);
            } else {
                if (votos.size >= LIMITE) {
                    mostrarToast('Você já escolheu 2 filmes!', '⚠');
                    return;
                }
                votos.add(titulo);
                card.classList.add('selecionado');
                const badge = document.createElement('span');
                badge.className = 'badge-voto';
                badge.textContent = '✓ votado';
                card.appendChild(badge);
                mostrarToast(`"${titulo}" adicionado ao voto`, '🎬');
            }
            renderVotos();
        });
    });

    function renderVotos() {
        listaVotos.innerHTML = '';
        votos.forEach(titulo => {
            const li = document.createElement('li');
            li.textContent = titulo;
            const btn = document.createElement('button');
            btn.textContent = '×';
            btn.style.cssText = `
        background: none;
        border: none;
        color: var(--ouro);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0 0.3rem;
        line-height: 1;
      `;
            btn.addEventListener('click', () => {
                votos.delete(titulo);
                const card = [...cards].find(c => c.querySelector('h3').textContent === titulo);
                if (card) {
                    card.classList.remove('selecionado');
                    const badge = card.querySelector('.badge-voto');
                    if (badge) badge.remove();
                }
                mostrarToast(`"${titulo}" removido dos votos`, '✕', true);
                renderVotos();
            });
            li.appendChild(btn);
            listaVotos.appendChild(li);
        });
    }

    btnFinalizar.addEventListener('click', () => {

        if (votos.size === 0) {
            mostrarToast('Escolha pelo menos dois filmes!', '⚠');
            return;
        }

        const lista = [...votos].join(' e ');

        const numero = '5511939483539';

        const mensagem = `
        CINEMARSÁRIO MEL

        oi mel!! meus votos para a sessão cinema foram:

        ${lista}

        mal posso esperar pelo cinemarsário!
        `;

        const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

        mostrarToast('Redirecionando para o WhatsApp...');

        setTimeout(() => {
            window.open(link, '_blank');
        }, 1200);

    });
});
const carrossel = document.getElementById('carrossel');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

let scrollAmount = 0; // Controle do deslocamento

// Função para rolar para a direita
btnRight.addEventListener('click', () => {
    const containerWidth = carrossel.offsetWidth;
    const scrollWidth = carrossel.scrollWidth;

    if (scrollAmount + containerWidth < scrollWidth) {
        scrollAmount += containerWidth;
        carrossel.style.transform = `translateX(-${scrollAmount}px)`;
    }
});

// Função para rolar para a esquerda
btnLeft.addEventListener('click', () => {
    const containerWidth = carrossel.offsetWidth;

    if (scrollAmount > 0) {
        scrollAmount -= containerWidth;
        carrossel.style.transform = `translateX(-${scrollAmount}px)`;
    }
});

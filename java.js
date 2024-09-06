// Função para alternar a exibição do dropdown e o estado do botão
document.querySelector('.select-display').addEventListener('click', function(event) {
    var dropdown = this.nextElementSibling;
    var isVisible = dropdown.classList.contains('show');

    // Alterna a visibilidade do dropdown e a classe ativa do botão
    dropdown.classList.toggle('show', !isVisible);
    this.classList.toggle('active', !isVisible);

    // Evita que o clique no botão feche o dropdown
    event.stopPropagation();
});

// Fecha o dropdown ao clicar fora dele e do botão
document.addEventListener('click', function(event) {
    var dropdown = document.querySelector('.select-items');
    var display = document.querySelector('.select-display');

    // Verifica se o dropdown está aberto e se o clique foi fora dele e do botão
    if (!dropdown.contains(event.target) && !display.contains(event.target)) {
        dropdown.classList.remove('show'); // Fecha o dropdown
        display.classList.remove('active'); // Remove o estado ativo do botão
    }
});


document.querySelectorAll('.select-items .item').forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.preventDefault(); // Evita o comportamento padrão do link
        var url = this.getAttribute('data-url'); // Obtém a URL do atributo data-url
        var dropdown = this.closest('.select-items');

        dropdown.classList.remove('show'); // Fecha o dropdown
        document.querySelector('.select-display').classList.remove('active'); // Remove a classe ativa do botão

        if (url) {
            window.location.href = url; // Redireciona para a URL
        }
    });
});


// Seleciona o campo de pesquisa e os botões que devem ser escondidos
const searchBar = document.getElementById('search-bar');
const buttonsToHide = document.querySelectorAll('.nav-home .custom-select, .button-nav, .select-display');

// Adiciona um evento de foco à barra de pesquisa
searchBar.addEventListener('focus', function() {
    buttonsToHide.forEach(button => {
        button.classList.add('hidden-buttons');
    });
});

// Adiciona um evento de desfoco à barra de pesquisa
searchBar.addEventListener('blur', function() {
    buttonsToHide.forEach(button => {
        button.classList.remove('hidden-buttons');
    });
});


document.addEventListener('DOMContentLoaded', function() {

    var slider = new SwiffySlider('.swiffy-slider');
    
    var nextButton = document.querySelector('.slider-nav-next');
    var prevButton = document.querySelector('.slider-nav-next"');
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            slider.next();
        });
    } else {
        console.log('Next button not found');
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            slider.prev();
        });
    } else {
        console.log('Prev button not found');
    }
});

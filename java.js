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

document.addEventListener("DOMContentLoaded", function () {
  let count = 0;
  const shopButtons = document.querySelectorAll(".shop-button"); // Seleciona todos os botões
  const ellipseCart = document.getElementById("ellipse_cart");
  const cartCount = document.getElementById("cart_count");

  shopButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      if (count === 0) {
        ellipseCart.style.display = "inline";
        cartCount.style.display = "flex";
      }
      count++;
      cartCount.textContent = count;
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const wantButtons = document.querySelectorAll(".want-button"); // Seleciona todos os botões com a classe want-button

  wantButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault(); // Previne a ação padrão do botão
      window.location.href = "login.html"; // Substitua pelo URL da página para onde deseja redirecionar
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const sliderContainer = document.querySelector(".slider-container");
  const slides = sliderContainer.querySelectorAll("li");

  let currentIndex = 0;
  let slideWidth = slides[0].offsetWidth;
  const slideGap = 20;

  let totalWidth = (slideWidth + slideGap) * slides.length - slideGap;

  function updateCarousel() {
    const containerWidth = sliderContainer.parentElement.offsetWidth;
    const maxTranslateX = totalWidth - containerWidth;

    // Limitar o índice do carrossel para não ultrapassar os limites
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex * (slideWidth + slideGap) > maxTranslateX) {
      currentIndex = Math.floor(maxTranslateX / (slideWidth + slideGap));
    }

    // Aplica a transição de deslocamento (translateX) ao carrossel
    sliderContainer.style.transform = `translateX(-${
      currentIndex * (slideWidth + slideGap)
    }px)`;

    // Atualizar estado dos botões de navegação
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled =
      currentIndex * (slideWidth + slideGap) >= maxTranslateX;

    prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
    nextButton.style.opacity =
      currentIndex * (slideWidth + slideGap) >= maxTranslateX ? "0.5" : "1";
  }

  // Evento de clique no botão "Anterior"
  prevButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  // Evento de clique no botão "Próximo"
  nextButton.addEventListener("click", function () {
    currentIndex++;
    updateCarousel();
  });

  // Recalcula a largura dos slides ao redimensionar a janela
  window.addEventListener("resize", function () {
    slideWidth = slides[0].offsetWidth;
    totalWidth = (slideWidth + slideGap) * slides.length - slideGap;
    updateCarousel();
  });

  // Inicializar o carrossel
  updateCarousel();
});
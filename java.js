// Função para alternar a exibição do dropdown e o estado do botão
document.querySelector('.select-display').addEventListener('click', function(event) {
    var dropdown = this.nextElementSibling;
    var isVisible = dropdown.classList.contains('show');

    dropdown.classList.toggle('show', !isVisible);
    this.classList.toggle('active', !isVisible);

    event.stopPropagation();
});

document.addEventListener('click', function(event) {
    var dropdown = document.querySelector('.select-items');
    var display = document.querySelector('.select-display');

    if (!dropdown.contains(event.target) && !display.contains(event.target)) {
        dropdown.classList.remove('show'); 
        display.classList.remove('active');
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

 //API do Youtube para o vídeo 

document.addEventListener("DOMContentLoaded", function () {
  const playlistId = "PLsAZ9VYSyO13Wp5GD8wM5OYtfMV0sck46";
  const apiUrl = `/api/youtube/playlist?playlistId=${playlistId}`;

  async function loadPlaylist() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("API Response:", data); // Adicione este log
      const videoList = data.items;

      const videoFrame = document.getElementById("video-frame");
      const videoListContainer = document.getElementById("video-list");

      // Limpa a lista de vídeos antes de adicionar novos
      videoListContainer.innerHTML = "";

      // Adiciona vídeos à lista e define o primeiro vídeo como padrão
      videoList.forEach((video, index) => {
        const videoId = video.snippet.resourceId.videoId;
        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.medium.url;

        console.log("Processing videoId:", videoId); // Adicione este log

        // Adiciona item à lista
        const listItem = document.createElement("li");
        listItem.classList.add("video-thumbnail");
        listItem.innerHTML = `
                            <a href="#" data-video-id="${videoId}">
                                <img src="${videoThumbnail}" alt="${videoTitle}" width="120" height="90">
                                ${videoTitle}
                            </a>
                        `;
        videoListContainer.appendChild(listItem);

        // Define o primeiro vídeo como padrão
        if (index === 0) {
          videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
        }
      });

      // Configura o evento de clique para mudar o vídeo
      videoListContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "A" || event.target.tagName === "IMG") {
          event.preventDefault();
          const videoId = event.target
            .closest("a")
            .getAttribute("data-video-id");
          videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // ?autoplay=1 para iniciar automaticamente
        }
      });
    } catch (error) {
      console.error("Error loading playlist:", error);
    }
  }

  // Carrega a playlist ao iniciar
  loadPlaylist();
});

document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');

    if (username) {
        const cadastroButton = document.querySelector('.button-cadastro');

        if (cadastroButton) {
            cadastroButton.textContent = `${username}`;
        }
    }
});
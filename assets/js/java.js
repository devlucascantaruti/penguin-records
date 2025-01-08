document.querySelector(".logo").addEventListener("click", function () {
  window.location.href = "index.html";
});

function toggleDropdown() {
  var dropdownContent = document.getElementById("markdown-content");
  if (dropdownContent.classList.contains("hidden")) {
    dropdownContent.classList.remove("hidden");
    dropdownContent.style.display = "block";
  } else {
    dropdownContent.classList.add("hidden");
    dropdownContent.style.display = "none";
  }
}

document
  .querySelector(".select-display")
  .addEventListener("click", function (event) {
    var dropdown = this.nextElementSibling;
    var isVisible = dropdown.classList.contains("show");

    dropdown.classList.toggle("show", !isVisible);
    this.classList.toggle("active", !isVisible);

    var icon = this.querySelector(".setaprabaixo");
    if (isVisible) {
      icon.setAttribute("name", "caret-down");
    } else {
      icon.setAttribute("name", "caret-up");
    }

    toggleDropdown();
    event.stopPropagation();
  });

document.addEventListener("click", function (event) {
  var dropdown = document.querySelector(".select-items");
  var display = document.querySelector(".select-display");
  var markdownContent = document.getElementById("markdown-content");

  if (
    !dropdown.contains(event.target) &&
    !display.contains(event.target) &&
    !markdownContent.contains(event.target)
  ) {
    dropdown.classList.remove("show");
    display.classList.remove("active");
    var icon = display.querySelector(".setaprabaixo");
    icon.setAttribute("name", "caret-down");
  }
});

document.querySelectorAll(".select-items .item").forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.preventDefault();
    var url = this.getAttribute("data-url");
    var dropdown = this.closest(".select-items");
    dropdown.classList.remove("show");
    document.querySelector(".select-display").classList.remove("active");

    if (url) {
      window.location.href = url;
    }
  });
});

// Search Bar
const searchBar = document.getElementById("search-bar");
const searchContainer = document.querySelector(".search-container");
const buttonsToHide = document.querySelectorAll(
  ".nav-home .custom-select, .button-nav, .select-display"
);

searchBar.addEventListener("focus", function () {
  // Ocultar elementos da navegação quando a barra de pesquisa recebe foco
  buttonsToHide.forEach((button) => {
    button.classList.add("hidden");
  });
});

searchBar.addEventListener("blur", function () {
  // Mostrar elementos da navegação quando a barra de pesquisa perde o foco
  buttonsToHide.forEach((button) => {
    button.classList.remove("hidden");
  });
});

// Primeiro Carrossel de Discos
document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const sliderContainer = document.querySelector(".slider-container");

  let currentIndex = 0;
  const slideGap = 22.5;

  async function loadDisks() {
    try {
      const response = await fetch("http://localhost:5000/api/discos");
      if (!response.ok) {
        throw new Error("Erro ao carregar discos");
      }
      const discos = await response.json();

      console.log(discos);

      const slides = discos
        .map((disco) => {
          return `
          <li class="slide">
            <div class="album-info">
              <img src="${disco.imagem}" alt="${disco.albumTitle}" class="album-image">
              <h3>${disco.titulo}</h3>
              <span class="artist-name">${disco.artista}</span>
              <p>${disco.ano}</p>
              <p>${disco.genero}</p>
              <p>${disco.tipo}</p>
              <p>${disco.copias} copies from $${disco.preco}</p>
            </div>
            <div class="album-buttons">
              <button class="shop-button">Shop</button>
              <button class="want-button">Want</button>
            </div>
          </li>
        `;
        })
        .join("");

      sliderContainer.innerHTML = slides;
      updateCarousel();

      const shopButtons = document.querySelectorAll(".shop-button");
      shopButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const discoInfo = {
            imagem: event.target.closest("li").querySelector(".album-image")
              .src,
            titulo: event.target.closest("li").querySelector("h3").textContent,
            artista: event.target.closest("li").querySelector(".artist-name")
              .textContent,
            ano: parseInt(
              event.target.closest("li").querySelector("p:nth-of-type(1)")
                .textContent
            ),
            genero: event.target.closest("li").querySelector("p:nth-of-type(2)")
              .textContent,
            tipo: event.target.closest("li").querySelector("p:nth-of-type(3)")
              .textContent,
          };

          // Armazena as informações do disco no localStorage
          localStorage.setItem("discoInfo", JSON.stringify(discoInfo));

          // Redireciona para a página carrinho.html em uma nova aba
          window.open("carrinho.html", "_blank");
        });
      });

      const wantButtons = document.querySelectorAll(".want-button");
      wantButtons.forEach((button) => {
        button.addEventListener("click", () => {
          window.location.href = "login.html";
        });
      });
    } catch (error) {
      console.error("Erro ao carregar discos:", error);
    }
  }

  function updateCarousel() {
    const slides = sliderContainer.querySelectorAll("li");
    const slideWidth =
      slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
    const totalWidth = (slideWidth + slideGap) * slides.length - slideGap;
    const containerWidth = sliderContainer.parentElement.offsetWidth;
    const maxTranslateX = totalWidth - containerWidth;

    console.log("Slide Width:", slideWidth);
    console.log("Max Translate X:", maxTranslateX);

    sliderContainer.style.transform = `translateX(-${
      currentIndex * (slideWidth + slideGap)
    }px)`;

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex * (slideWidth + slideGap) > maxTranslateX) {
      currentIndex = Math.floor(maxTranslateX / (slideWidth + slideGap));
    }

    // Atualizar estado dos botões de navegação
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled =
      currentIndex * (slideWidth + slideGap) >= maxTranslateX;

    prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
    nextButton.style.opacity =
      currentIndex * (slideWidth + slideGap) >= maxTranslateX ? "0.5" : "1";
  }

  prevButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener("click", function () {
    currentIndex++;
    updateCarousel();
  });

  window.addEventListener("resize", function () {
    updateCarousel();
  });

  loadDisks();

  // Segundo Carrossel (Lancamentos)
  const prevLancamentosButton = document.querySelector("#prev-lancamentos");
  const nextLancamentosButton = document.querySelector("#next-lancamentos");
  const lancamentosSliderContainer = document.querySelector(
    "#slider-lancamentos"
  );

  let lancamentosIndex = 0;

  async function loadLancamentos() {
    try {
      const response = await fetch("http://localhost:5000/api/lancamentos");
      if (!response.ok) {
        throw new Error("Erro ao carregar lançamentos");
      }
      const lancamentos = await response.json();

      const lancamentoSlides = lancamentos
        .map((lancamento) => {
          return `
            <li class="slide">
              <div class="album-info">
                <img src="${lancamento.imagem}" alt="${lancamento.albumTitle}" class="album-image">
                <h3>${lancamento.titulo}</h3>
                <span class="artist-name">${lancamento.artista}</span>
                <p>${lancamento.ano}</p>
                <p>${lancamento.genero}</p>
                <p>${lancamento.tipo}</p>
                <p>${lancamento.copias} copies from $${lancamento.preco}</p>
              </div>
              <div class="album-buttons">
                <button class="shop-button">Shop</button>
                <button class="want-button">Want</button>
              </div>
            </li>
          `;
        })
        .join("");

      lancamentosSliderContainer.innerHTML = lancamentoSlides;
      updateLancamentosCarousel();

      const shopButtons = document.querySelectorAll(".shop-button");
      shopButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const discoInfo = {
            imagem: event.target.closest("li").querySelector(".album-image")
              .src,
            titulo: event.target.closest("li").querySelector("h3").textContent,
            artista: event.target.closest("li").querySelector(".artist-name")
              .textContent,
            ano: parseInt(
              event.target.closest("li").querySelector("p:nth-of-type(1)")
                .textContent
            ),
            genero: event.target.closest("li").querySelector("p:nth-of-type(2)")
              .textContent,
            tipo: event.target.closest("li").querySelector("p:nth-of-type(3)")
              .textContent,
          };

          localStorage.setItem("discoInfo", JSON.stringify(discoInfo));
          window.open("carrinho.html", "_blank");
        });
      });

      const wantButtons = document.querySelectorAll(".want-button");
      wantButtons.forEach((button) => {
        button.addEventListener("click", () => {
          window.location.href = "login.html";
        });
      });
    } catch (error) {
      console.error("Erro ao carregar lançamentos:", error);
    }
  }

  function updateLancamentosCarousel() {
    const slides = lancamentosSliderContainer.querySelectorAll("li");
    const slideWidth =
      slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
    const totalWidth = (slideWidth + slideGap) * slides.length - slideGap;
    const containerWidth = lancamentosSliderContainer.parentElement.offsetWidth;
    const maxTranslateX = totalWidth - containerWidth;

    lancamentosSliderContainer.style.transform = `translateX(-${
      lancamentosIndex * (slideWidth + slideGap)
    }px)`;

    if (lancamentosIndex < 0) lancamentosIndex = 0;
    if (lancamentosIndex * (slideWidth + slideGap) > maxTranslateX) {
      lancamentosIndex = Math.floor(maxTranslateX / (slideWidth + slideGap));
    }

    prevLancamentosButton.disabled = lancamentosIndex === 0;
    nextLancamentosButton.disabled =
      lancamentosIndex * (slideWidth + slideGap) >= maxTranslateX;

    prevLancamentosButton.style.opacity = lancamentosIndex === 0 ? "0.5" : "1";
    nextLancamentosButton.style.opacity =
      lancamentosIndex * (slideWidth + slideGap) >= maxTranslateX ? "0.5" : "1";
  }

  prevLancamentosButton.addEventListener("click", function () {
    if (lancamentosIndex > 0) {
      lancamentosIndex--;
      updateLancamentosCarousel();
    }
  });

  nextLancamentosButton.addEventListener("click", function () {
    lancamentosIndex++;
    updateLancamentosCarousel();
  });

  window.addEventListener("resize", function () {
    updateLancamentosCarousel();
  });

  loadLancamentos();
});

// Dots Pagination Discos e Lancamentos

document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const sliderContainer = document.querySelector("#slider-container");
  const dots = document.querySelectorAll("#discos-indicators .dot");

  const prevLancamentosButton = document.querySelector("#prev-lancamentos");
  const nextLancamentosButton = document.querySelector("#next-lancamentos");
  const lancamentosSliderContainer = document.querySelector(
    "#slider-lancamentos"
  );
  const lancamentosDots = document.querySelectorAll(
    "#lancamentos-indicators .dot"
  );

  let currentIndex = 0;
  let lancamentosIndex = 0;
  const slideGap = 22.5;

  // Atualiza os indicadores de discos
  function updateDiscosIndicators() {
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // Atualiza os indicadores de lançamentos
  function updateLancamentosIndicators() {
    lancamentosDots.forEach((dot, index) => {
      if (index === lancamentosIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // Atualiza o carrossel de discos
  function updateCarousel() {
    const slides = sliderContainer.querySelectorAll("li");
    const slideWidth =
      slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
    const totalWidth = (slideWidth + slideGap) * slides.length - slideGap;
    const containerWidth = sliderContainer.parentElement.offsetWidth;
    const maxTranslateX = totalWidth - containerWidth;

    sliderContainer.style.transform = `translateX(-${
      currentIndex * (slideWidth + slideGap)
    }px)`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled =
      currentIndex * (slideWidth + slideGap) >= maxTranslateX;
    prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
    nextButton.style.opacity =
      currentIndex * (slideWidth + slideGap) >= maxTranslateX ? "0.5" : "1";

    updateDiscosIndicators(); // Atualiza os pontos
  }

  // Atualiza o carrossel de lançamentos
  function updateLancamentosCarousel() {
    const slides = lancamentosSliderContainer.querySelectorAll("li");
    const slideWidth =
      slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
    const totalWidth = (slideWidth + slideGap) * slides.length - slideGap;
    const containerWidth = lancamentosSliderContainer.parentElement.offsetWidth;
    const maxTranslateX = totalWidth - containerWidth;

    lancamentosSliderContainer.style.transform = `translateX(-${
      lancamentosIndex * (slideWidth + slideGap)
    }px)`;

    prevLancamentosButton.disabled = lancamentosIndex === 0;
    nextLancamentosButton.disabled =
      lancamentosIndex * (slideWidth + slideGap) >= maxTranslateX;
    prevLancamentosButton.style.opacity = lancamentosIndex === 0 ? "0.5" : "1";
    nextLancamentosButton.style.opacity =
      lancamentosIndex * (slideWidth + slideGap) >= maxTranslateX ? "0.5" : "1";

    updateLancamentosIndicators(); // Atualiza os pontos
  }

  // Eventos para os botões de navegação de discos
  prevButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener("click", function () {
    currentIndex++;
    updateCarousel();
  });

  // Eventos para os botões de navegação de lançamentos
  prevLancamentosButton.addEventListener("click", function () {
    if (lancamentosIndex > 0) {
      lancamentosIndex--;
      updateLancamentosCarousel();
    }
  });

  nextLancamentosButton.addEventListener("click", function () {
    lancamentosIndex++;
    updateLancamentosCarousel();
  });

  // Função de atualização inicial (caso já tenha algo pré-carregado)
  function initialSetup() {
    updateCarousel();
    updateLancamentosCarousel();
  }

  // Chama a função de setup inicial
  initialSetup();
});

//Button-cadastro

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");

  if (username) {
    const cadastroButton = document.querySelector(".button-cadastro");

    if (cadastroButton) {
      cadastroButton.textContent = `${username}`;
    }
  }
});

import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

document.addEventListener("DOMContentLoaded", function () {
  const prevButtonBF = document.querySelector(".swiper-button-prev");
  const nextButtonBF = document.querySelector(".swiper-button-next");
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  async function loadBlackFridayDisks() {
    try {
      const response = await fetch("http://localhost:5000/api/blackfriday");
      if (!response.ok) {
        throw new Error("Erro ao carregar discos de Black Friday");
      }
      const discosBlackFriday = await response.json();

      const slides = discosBlackFriday
        .map((disco) => {
          return `
          <li class="swiper-slide">
            <div class="album-info">
              <img src="${disco.imagem}" alt="${disco.albumTitle}" class="album-image">
              <h3>${disco.titulo}</h3>
              <span class="artist-name">${disco.artista}</span>
              <p>${disco.ano}</p>
              <p>${disco.genero}</p>
              <p>${disco.tipo}</p>
              <p>${disco.copias} copies from $${disco.preco}</p>
            </div>
            <div class="album-buttons">
              <button class="shop-button">Shop</button>
              <button class="want-button">Want</button>
            </div>
          </li>
        `;
        })
        .join("");

      swiperWrapper.innerHTML = slides;

      // Inicializando o Swiper após injetar os slides
      const swiper = new Swiper(".swiper-container", {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });

      // Adicionando interações para os botões (Shop e Want)
      const shopButtons = document.querySelectorAll(".shop-button");
      console.log(shopButtons); // Verifique se os botões estão sendo selecionados
      shopButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const discoInfo = {
            imagem: event.target
              .closest(".swiper-slide")
              .querySelector(".album-image").src,
            titulo: event.target.closest(".swiper-slide").querySelector("h3")
              .textContent,
            artista: event.target
              .closest(".swiper-slide")
              .querySelector(".artist-name").textContent,
            ano: event.target
              .closest(".swiper-slide")
              .querySelector("p:nth-of-type(1)").textContent,
            genero: event.target
              .closest(".swiper-slide")
              .querySelector("p:nth-of-type(2)").textContent,
            tipo: event.target
              .closest(".swiper-slide")
              .querySelector("p:nth-of-type(3)").textContent,
          };

          localStorage.setItem("discoInfo", JSON.stringify(discoInfo));
          window.open("carrinho.html", "_blank");
        });
      });

      const wantButtons = document.querySelectorAll(".want-button");
      console.log(wantButtons); // Verifique se os botões estão sendo selecionados
      wantButtons.forEach((button) => {
        button.addEventListener("click", () => {
          window.location.href = "login.html";
        });
      });
    } catch (error) {
      console.error("Erro ao carregar discos de Black Friday:", error);
    }
  }

  loadBlackFridayDisks();
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
        if (event.target.tagName === "A") {
          const videoId = event.target.getAttribute("data-video-id");
          videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
        }
      });
    } catch (error) {
      console.error("Erro ao carregar playlist:", error);
    }
  }

  loadPlaylist();
});

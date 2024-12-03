document.addEventListener("DOMContentLoaded", function () {
  // Recupera as informações do disco armazenadas no localStorage
  const discoInfo = JSON.parse(localStorage.getItem("discoInfo"));

  if (discoInfo) {
    // Cria o conteúdo com as informações do disco
    const leftContainer = document.querySelector(".left-container");
    leftContainer.innerHTML = `
          <div class="disco-info">
            <img src="${discoInfo.imagem}" alt="${discoInfo.titulo}" class="album-image">
            <div class="disco-details">
            <h3>${discoInfo.titulo}</h3>
            <li>Artista:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${discoInfo.artista}</li>
            <li>Ano:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${discoInfo.ano}</li>
            <li>Tipo:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${discoInfo.tipo}</li>
            <li>Gênero:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${discoInfo.genero}</li>
          </div>
          </div>
        `;
  } else {
    // Caso não haja informações no localStorage, exibe uma mensagem
    const leftContainer = document.querySelector(".left-container");
    leftContainer.innerHTML = "<p>Não há discos no carrinho.</p>";
  }
});

  const slider = document.getElementById("preco-slider");
  const display = document.getElementById("preco-display");

  slider.addEventListener("input", function () {
    const precoFormatado = `R$ ${parseFloat(slider.value)
      .toFixed(2)
      .replace(".", ",")}`;
    display.textContent = precoFormatado;
  });
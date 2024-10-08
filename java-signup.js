const inputs = document.querySelectorAll(".input-group input");

// Função para tratar o foco no campo
function handleFocus(event) {
  event.target.placeholder = ""; // Remove o placeholder ao focar
}

// Função para tratar a perda de foco no campo
function handleBlur(event) {
  if (event.target.value === "") {
    event.target.placeholder = event.target.getAttribute("placeholder-text"); // Restaura o placeholder original
  }
}

// Adiciona os event listeners para focus e blur em cada campo
inputs.forEach((input) => {
  // Guarda o placeholder original
  input.setAttribute("placeholder-text", input.placeholder);

  input.addEventListener("focus", handleFocus);
  input.addEventListener("blur", handleBlur);
});

// Código para alternar visibilidade da senha
// Seleciona o botão e o campo de senha
const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");
const eyeIcon = document.querySelector(".toggle-password ion-icon");

// Alterna entre visibilidade da senha e altera a cor do placeholder
togglePassword.addEventListener("click", function () {
  const isPasswordType = passwordInput.getAttribute("type") === "password";

  // Alterna o tipo entre "password" e "text"
  passwordInput.setAttribute("type", isPasswordType ? "text" : "password");

  // Alterna o ícone do olho
  eyeIcon.setAttribute(
    "name",
    isPasswordType ? "eye-off-outline" : "eye-outline"
  );

  // Adiciona ou remove a classe para mudar a cor da borda e do placeholder
  if (isPasswordType) {
    passwordInput.classList.add("password-visible");
  }

  passwordInput.blur();
});

// Exibe o input-label-password apenas quando o usuário focar no input
passwordInput.addEventListener("focus", function () {
  passwordInput.classList.add("focused");
  passwordInput.classList.add("password-visible");
});

// Esconde o input-label-password se o campo estiver vazio ao perder o foco
passwordInput.addEventListener("blur", function () {
  if (passwordInput.value === "") {
    passwordInput.classList.remove("focused");
    passwordInput.classList.remove("password-visible");
  }
});

document.addEventListener("click", function (event) {
  if (
    !passwordInput.contains(event.target) &&
    !togglePassword.contains(event.target)
  ) {
    passwordInput.classList.remove("password-visible");
    // Adicionalmente, você pode remover a classe 'focused' se necessário
    passwordInput.classList.remove("focused");
  }
});

  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log({ username, email, password });

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert(data.message); // Exibe a mensagem de resposta do servidor

    // Aqui você pode adicionar lógica adicional, como redirecionar o usuário após o registro
    if (response.ok) {
      // Redirecionar ou limpar o formulário, se necessário
      // window.location.href = "/login"; // Exemplo de redirecionamento
    }
  });
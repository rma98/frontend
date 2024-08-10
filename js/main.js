document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const type = document.getElementById("type").value;
  
        const response = await fetch("http://localhost:8080/api/servidores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, type }),
        });
  
        if (response.ok) {
          alert("Registro bem-sucedido!");
          window.location.href = "login.html";
        } else {
          alert("Falha no registro. Tente novamente.");
        }
      });
    }
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
  
        const response = await fetch("http://localhost:8080/api/authenticate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("user", JSON.stringify(data));
          window.location.href = "dashboard.html";
        } else {
          alert("Login falhou. Verifique suas credenciais.");
        }
      });
    }

    if (!user) {
        window.location.href = "login.html";
      }
    
      const userInfo = document.getElementById("userInfo");
      const salaList = document.getElementById("salaList");
      const reservaFormContainer = document.getElementById("reservaFormContainer");
      const manageSalaContainer = document.getElementById("manageSalaContainer");
    
      userInfo.innerHTML = `<h3>Bem-vindo, ${user.name}</h3><p>Tipo: ${user.type}</p>`;
    
      async function fetchSalas() {
        const response = await fetch("http://localhost:8080/api/salas");
        const salas = await response.json();
        salaList.innerHTML = `<h3>Salas Disponíveis</h3>${salas.map(sala => `
          <div>
            <p><strong>${sala.nome}</strong> (${sala.tipo}) - Disponível: ${sala.disponivel ? 'Sim' : 'Não'}</p>
            ${user.type === 'coordenador' ? `<button onclick="deleteSala(${sala.id})">Deletar</button>` : ''}
          </div>
        `).join('')}`;
      }
    
      if (user.type === 'coordenador') {
        manageSalaContainer.innerHTML = `
          <h3>Adicionar Nova Sala</h3>
          <form id="addSalaForm">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required>
            <label for="tipo">Tipo:</label>
            <input type="text" id="tipo" name="tipo" required>
            <label for="disponivel">Disponível:</label>
            <input type="checkbox" id="disponivel" name="disponivel">
            <button type="submit">Adicionar Sala</button>
          </form>
        `;
    
        const addSalaForm = document.getElementById("addSalaForm");
        addSalaForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const nome = document.getElementById("nome").value;
          const tipo = document.getElementById("tipo").value;
          const disponivel = document.getElementById("disponivel").checked;
    
          const response = await fetch("http://localhost:8080/api/salas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, tipo, disponivel }),
          });
    
          if (response.ok) {
            fetchSalas();
          } else {
            alert("Falha ao adicionar sala.");
          }
        });
      }
    
      async function deleteSala(id) {
        const response = await fetch(`http://localhost:8080/api/salas/${id}`, {
          method: "DELETE",
        });
    
        if (response.ok) {
          fetchSalas();
        } else {
          alert("Falha ao deletar sala.");
        }
      }
    
      fetchSalas();
  });
  
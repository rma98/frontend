<template>
  <div class="register-container">
    <h1>Cadastro</h1>
    <form @submit.prevent="registerUser">
      <div>
        <label for="name">Nome:</label>
        <input type="text" v-model="user.nome" id="name" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="user.email" id="email" required />
      </div>
      <div>
        <label for="password">Senha:</label>
        <input type="password" v-model="user.senha" id="password" required />
      </div>
      <div>
        <label for="type">Tipo de Usuário:</label>
        <select v-model="user.tipo" id="type" required>
          <option value="Professor">Professor</option>
          <option value="Coordenador">Coordenador</option>
        </select>
      </div>
      <button type="submit">Registrar</button>
    </form>
    <p v-if="registrationError" class="error">{{ registrationError }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        nome: '',
        email: '',
        senha: '',
        tipo: 'Professor' // Valor padrão
      },
      registrationError: ''
    };
  },
  methods: {
    async registerUser() {
      if (!this.validateUser()) {
        return;
      }

      try {
        console.log('Enviando dados:', this.user);

        const response = await fetch('http://localhost:8080/api/servidores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.user),
        });

        console.log('Resposta do servidor:', response);

        if (response.ok) {
          alert('Usuário registrado com sucesso!');
          this.$router.push('/login');
        } else {
          const errorData = await response.text();
          console.error('Erro detalhado:', errorData);
          this.registrationError = 'Erro ao registrar o usuário: ' + errorData;
        }
      } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        this.registrationError = 'Ocorreu um erro ao registrar o usuário. Tente novamente.';
      }
    },
    validateUser() {
      if (!this.user.nome || !this.user.email || !this.user.senha) {
        this.registrationError = 'Todos os campos são obrigatórios.';
        return false;
      }

      // Exemplo de validação de e-mail e senha
      if (!/\S+@\S+\.\S+/.test(this.user.email)) {
        this.registrationError = 'O e-mail fornecido é inválido.';
        return false;
      }

      if (this.user.senha.length < 6) {
        this.registrationError = 'A senha deve ter pelo menos 6 caracteres.';
        return false;
      }

      this.registrationError = '';
      return true;
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

.register-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

input, select, button {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
}

button {
  background-color: #5cb85c;
  color: white;
  border: none;
  cursor: pointer;
}
  
button:hover {
  background-color: #4cae4c;
}

.error {
  color: red;
}
</style>

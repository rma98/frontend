<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="password">Senha:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="loginError" class="error">{{ loginError }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      loginError: ''
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify({ token: data.token }));
          this.$router.push('/dashboard'); // Redireciona para o dashboard após o login
        } else {
          const errorData = await response.json();
          this.loginError = `Erro ao fazer login: ${errorData.message || 'Erro desconhecido'}`;
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        this.loginError = 'Ocorreu um erro ao fazer login. Tente novamente.';
      }
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

.login-container {
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

input, button {
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

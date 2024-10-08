<template>
  <div class="container">
    <h2>Dashboard</h2>
    <div id="userInfo">
      <h3>Bem-vindo, {{ user.name }}</h3>
      <p>Tipo: {{ user.type }}</p>
    </div>
    
    <div id="salaList">
      <h3>Salas Disponíveis</h3>
      <div v-for="sala in salas" :key="sala.id">
        <p><strong>{{ sala.nome }}</strong> ({{ sala.tipo }}) - Disponível: {{ sala.disponivel ? 'Sim' : 'Não' }}</p>
        <button v-if="user.type === 'coordenador'" @click="deleteSala(sala.id)">Deletar</button>
        
        <!-- Seção para Gerenciar Recursos -->
        <div v-if="user.type === 'coordenador'">
          <h4>Recursos</h4>
          <div v-for="recurso in sala.recursos" :key="recurso.id">
            <p>{{ recurso.nome }}: {{ recurso.descricao }}</p>
            <button @click="deleteRecurso(recurso.id)">Deletar Recurso</button>
          </div>
          
          <form @submit.prevent="addRecurso(sala.id)">
            <label for="nomeRecurso">Nome:</label>
            <input v-model="newRecurso.nome" type="text" id="nomeRecurso" required>
            <label for="descricaoRecurso">Descrição:</label>
            <input v-model="newRecurso.descricao" type="text" id="descricaoRecurso" required>
            <button type="submit">Adicionar Recurso</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      user: null,
      salas: [],
      newRecurso: {
        nome: '',
        descricao: ''
      },
      errorMessage: '',
    };
  },
  methods: {
    async fetchSalas() {
      try {
        const response = await fetch("http://localhost:8080/api/salas");
        if (!response.ok) {
          throw new Error('Falha ao buscar salas');
        }
        this.salas = await response.json();
        for (let sala of this.salas) {
          sala.recursos = await this.fetchRecursos(sala.id);
        }
      } catch (error) {
        this.errorMessage = error.message;
        console.error("Falha ao buscar salas", error);
      }
    },
    async fetchRecursos(salaId) {
      try {
        const response = await fetch(`http://localhost:8080/api/recursos/sala/${salaId}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar recursos');
        }
        return await response.json();
      } catch (error) {
        this.errorMessage = error.message;
        console.error("Falha ao buscar recursos", error);
        return [];
      }
    },
    async deleteSala(id) {
      try {
        const response = await fetch(`http://localhost:8080/api/salas/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Falha ao deletar sala');
        }
        this.fetchSalas();
      } catch (error) {
        this.errorMessage = error.message;
        console.error("Falha ao deletar sala", error);
      }
    },
    async deleteRecurso(id) {
      try {
        const response = await fetch(`http://localhost:8080/api/recursos/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Falha ao deletar recurso');
        }
        this.fetchSalas();
      } catch (error) {
        this.errorMessage = error.message;
        console.error("Falha ao deletar recurso", error);
      }
    },
    async addRecurso(salaId) {
      try {
        const response = await fetch(`http://localhost:8080/api/recursos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: this.newRecurso.nome,
            descricao: this.newRecurso.descricao,
            salaId: salaId
          }),
        });
        if (!response.ok) {
          throw new Error('Falha ao adicionar recurso');
        }
        this.newRecurso.nome = '';
        this.newRecurso.descricao = '';
        this.fetchSalas();
      } catch (error) {
        this.errorMessage = error.message;
        console.error("Falha ao adicionar recurso", error);
      }
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      this.fetchSalas();
    } else {
      this.$router.push('/login'); // Redireciona para login se o usuário não estiver autenticado
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

#userInfo, #salaList {
  margin-bottom: 20px;
}

button {
  background-color: #5cb85c;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #4cae4c;
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

.error {
  color: red;
}
</style>

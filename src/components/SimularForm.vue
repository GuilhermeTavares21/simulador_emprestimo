<template>
  <div>
    
    <form @submit.prevent="submitForm">
      <h2 class="form_title">Faça sua simulação agora!</h2>
      <span class="detail"></span>
      <div>
        <label for="valor">Valor do Empréstimo <p class="warning">* Valor mínimo de R$ 100,00.</p></label>
        <div class="entrada_valor">
          <p class="prefixo">R$</p>
          <input class="input_valor"
            v-model="form.valor"
            type="text"
            id="valor"
            required
            @input="formatCurrency"
          />
        </div>
      </div>

      <div>
        <label for="instituicoes">Instituição</label>
        <select multiple v-model="form.instituicoes" id="instituicoes">
          <option v-for="instituicao in instituicoes" :key="instituicao.chave" :value="instituicao.chave">
            {{ instituicao.valor }}
          </option>
        </select>
      </div>

      <div>
        <label for="convenios">Convênio</label>
        <select multiple v-model="form.convenios" id="convenios">
          <option v-for="convenio in convenios" :key="convenio.chave" :value="convenio.chave">
            {{ convenio.valor }}
          </option>
        </select>
      </div>

      <div>
        <label for="parcelas">Parcelas</label>
        <select v-model="form.parcela" id="parcelas">
          <option v-for="parcela in parcelas" :key="parcela" :value="parcela">
            {{ parcela }}
          </option>
        </select>
      </div>
      <div class="form_btn">
        <button type="submit">Simular</button>
      </div>
    </form>
    
    <div class="modalInfos" v-if="showModal">
      <div class="head_modal" v-if="showModal">
        <h1>Simulações</h1>
        <button @click="closeModal" class="close_btn">Fechar</button>
      </div>
      <div v-if="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>
      <h4 v-if="simulationResult.length <= 0">Infelizmente não foi possível localizar nenhuma oportunidade com essas informações.</h4>
      <div v-for="(results, instituicao) in simulationResult" :key="instituicao">
          <h3 class="inst">{{ instituicao }}</h3>
          <ul v-for="result in results" :key="result.convenio">
              <li>Convênio: {{ result.convenio }}</li>
              <li>Taxa de Juros ao Mês: {{ result.taxa }}</li>
              <li class="font-bold">Parcelas: {{ result.parcelas }}</li>
              <li class="font-bold">Valor da Parcela: R$ {{ formatTotal(result.valor_parcela) }}</li>
              <li class="font-bold">Valor Total: R$ {{ formatTotal(result.parcelas * result.valor_parcela) }}</li>
          </ul>
      </div>
    </div>
  </div>
  <transition name="fade">
        <div v-if="errorMessageForm" class="feedback">
          <p>{{ errorMessageForm }}</p>
        </div>
  </transition>
</template>



<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        valor: null,
        instituicoes: [],
        convenios: [],
        parcela: null,
      },
      instituicoes: [],
      convenios: [],
      parcelas: [36, 48, 60, 72, 84],
      simulationResult: [],
      showModal: false,
      errorMessage: '',
      errorMessageForm: '',
    };
  },
  mounted() {
    this.fetchInstituicoes();
    this.fetchConvenios();
  },
  methods: {
    async fetchInstituicoes() {
      const response = await axios.get('http://localhost:8000/api/instituicao');
      this.instituicoes = response.data;
    },
    async fetchConvenios() {
      const response = await axios.get('http://localhost:8000/api/convenio');
      this.convenios = response.data;
    },
    formatCurrency(event) {
      let value = event.target.value;
      value = value.replace(/\D/g, '');
      if (value) {
        value = (parseFloat(value) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        this.form.valor = value;
        event.target.value = value;
      } else {
        this.form.valor = '';
        event.target.value = '';
      }
    },
    formatTotal(value) {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    async submitForm() {
      const valorEmprestimo = this.form.valor
        .replace(/\./g, '')
        .replace(',', '.');

        if (valorEmprestimo < 101 || valorEmprestimo > 1000000000000) {
          this.errorMessageForm = 'Digite um valor válido.';
          setTimeout(() => {
            this.errorMessageForm = '';
          }, 2500);
          return;
        }
        if (!this.form.parcela) {
          this.errorMessageForm = 'Você deve selecionar o número de parcelas.';
          setTimeout(() => {
            this.errorMessageForm = '';
          }, 2500);
          return;
        }
      const payload = {
        valor_emprestimo: parseFloat(valorEmprestimo),
        instituicoes: this.form.instituicoes,
        convenios: this.form.convenios,
        parcelas: parseInt(this.form.parcela, 10), 
      };
      const response = await axios.post('http://localhost:8000/api/simular', payload);
      this.simulationResult = response.data;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  },
};
</script>

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default {
  getInstituicoes() {
    return api.get('/instituicao');
  },
  getConvenios() {
    return api.get('/convenio');
  },
  simularEmprestimo(payload) {
    return api.post('/simular', payload);
  },
};

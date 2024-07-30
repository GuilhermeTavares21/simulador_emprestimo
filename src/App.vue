<template>
  <div id="app">
    <header>
      <div class="head">
          <div class="logo">
              <img src="./assets/img/logo.svg">
          </div>
          
      </div>
    </header>
    <main>
      <SimularForm/>
    </main>
  </div>
</template>

<script>
import SimularForm from './components/SimularForm.vue';
import './assets/css/styles.css';

export default {
  name: 'App',
  components: {
    SimularForm
  }
};
</script>

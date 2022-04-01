// import Vue from 'vue'
// import App from './App.vue'
// import './registerServiceWorker'
// import router from './router'
// import store from './store'
import "bootstrap/js/dist/collapse";
// import 'bootstrap'

// new Vue({
//   router,
//   store,
//   render: (h) => h(App)
// }).$mount('#app')

import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");

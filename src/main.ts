import "bootstrap/js/dist/collapse";

import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
// import store from "./store";

import { default as dayjs } from "dayjs";
import { default as duration } from "dayjs/plugin/duration";
dayjs.extend(duration);

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount("#app");

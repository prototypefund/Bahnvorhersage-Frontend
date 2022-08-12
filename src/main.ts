import "bootstrap/js/dist/collapse";

import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import { default as dayjs } from "dayjs";
import { default as duration } from "dayjs/plugin/duration";
dayjs.extend(duration);

createApp(App).use(store).use(router).mount("#app");

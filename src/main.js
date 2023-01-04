import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "./assets/main.css";

const app = createApp(App);

app.use(router);

app.mount("#app");

//bootstrap-vue
//app.use(BootstrapVue);
//app.use(IconsPlugin);

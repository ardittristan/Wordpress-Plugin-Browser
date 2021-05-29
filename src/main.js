import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueSnip from "vue-snip";

Vue.config.productionTip = false;
Vue.use(VueSnip);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

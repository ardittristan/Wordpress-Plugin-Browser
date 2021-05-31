import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./plugins/vue-snip";
import "./plugins/vuetify-dialog";
import "./plugins/vuetify-decorators";
import "./plugins/vue-toggles";

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

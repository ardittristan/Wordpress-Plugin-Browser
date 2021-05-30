import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueSnip from "vue-snip";
import "./plugins/vuetify-dialog";
import DialogLayout from "./components/GistSettingsLayout.vue";

Vue.config.productionTip = false;
Vue.use(VueSnip);

Vue.prototype.$dialog.layout("gist", DialogLayout);

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

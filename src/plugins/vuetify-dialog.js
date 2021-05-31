import Vue from "vue";
import VuetifyDialog from "vuetify-dialog";
import "vuetify-dialog/dist/vuetify-dialog.min.css";
import vuetify from "./vuetify";
import DialogLayout from "../components/GistSettingsLayout.vue";

Vue.use(VuetifyDialog, {
  context: {
    vuetify,
  },
});

Vue.prototype.$dialog.layout("gist", DialogLayout);

import Vue from "vue";
import VuetifyDialog from "vuetify-dialog";
import "vuetify-dialog/dist/vuetify-dialog.min.css";
import vuetify from "./vuetify";

Vue.use(VuetifyDialog, {
  context: {
    vuetify,
  },
});

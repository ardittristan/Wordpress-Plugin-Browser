import Vue from "vue";
import VuetifyDecorators from "vuetify-decorators";

import { VOverlay } from "vuetify/lib/components/VOverlay";
import { VProgressCircular } from "vuetify/lib/components/VProgressCircular";

Vue.component("v-overlay", VOverlay);
Vue.component("v-progress-circular", VProgressCircular);

Vue.use(VuetifyDecorators, {});

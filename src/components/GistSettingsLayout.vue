<template>
  <v-dialog
    ref="vdialog"
    eager
    content-class="vuedl-layout custom"
    v-model="isActive"
    :fullscreen="fullscreen"
    :max-width="getWidth"
    :persistent="persistent || loading"
    :scrollable="scrollable"
    :transition="transition"
    :hide-overlay="hideOverlay"
    :retain-focus="false"
    @keydown.esc="dismiss"
  >
    <div class="v-dialog-wrapper">
      <div
        v-if="showClose && !persistent && !loading"
        class="vuedl-layout__closeBtn"
        @click.stop="close"
      >
        ×
      </div>
      <dialog-child
        ref="dialog"
        v-bind="$options.propsData"
      />
    </div>
  </v-dialog>
</template>

<script>
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { VDialog } from "vuetify/lib";

  @Component({
    components: {
      VDialog,
    },
  })
  class GistSettingsLayout extends Vue {
    @Prop(Boolean) fullscreen;
    @Prop(Boolean) scrollable;
    @Prop(Boolean) hideOverlay;
    @Prop({ type: [String, Boolean], default: "dialog-transition" }) transition;
    @Prop({ type: Boolean, default: () => true }) showClose;

    _destroy() {
      setTimeout(() => {
        this.$destroy();
      }, 1000);
    }
  }
  export default GistSettingsLayout;
</script>

<style lang="scss">
.vuedl-layout.custom {
  position: relative;
  height: max-content;
  .v-dialog-wrapper {
    height: 100%;
    .vuedl-layout__closeBtn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 16px;
      height: 16px;
      font-family: -webkit-pictograph;
      font-size: 30px;
      opacity: 0.5;
      z-index: 1000;
      cursor: pointer;
      line-height: 0.5;
      display: block !important;
    }
    .vuedl-layout__closeBtn:hover {
      opacity: 1;
    }
  }
}
</style>

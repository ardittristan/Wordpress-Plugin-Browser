<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <header>Wordpress Plugin Browser</header>
      <v-spacer />
      <v-text-field
        v-model="search"
        solo
        hide-details
        dense
        clearable
        placeholder="Search Plugin"
        @keyup="onTyping()"
        @click:clear="onTyping()"
      >
        <template v-slot:label>
          Search Plugin <v-icon dense>mdi-magnify</v-icon>
        </template>
      </v-text-field>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
          >
            <VueToggles
              :value="sync"
              :checkedText="String.fromCharCode(160)"
              :uncheckedText="String.fromCharCode(160)"
              width="60"
              fontSize="0"
              checkedBg="var(--v-anchor-base)"
              uncheckedBg="var(--v-accent-lighten2)"
              dotColor="var(--v-primary-lighten5)"
              checkedColor="inherit"
              uncheckedColor="inherit"
              @click="sync = !sync"
              v-bind:class="{ syncing: isSyncing }"
            />
          </span>
        </template>
        <span>Sync Automatically</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            @click="onUpload()"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-upload
            </v-icon>
          </v-btn>
        </template>
        <span>Upload Favorites to Gist</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            @click="onDownload()"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </template>
        <span>Download Favorites from Gist</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            @click="onSettings"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-cog
            </v-icon>
          </v-btn>
        </template>
        <span>Gist Settings</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col
            v-for="plugin in plugins"
            :key="plugin.slug"
            cols="12"
            xl="4"
            lg="6"
            md="6"
            sm="12"
          >
            <plugin
              :plugin="plugin"
              :favorites="favorites"
              :meh="meh"
              @callAutoUpload="onAutoUpload"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="gistIdSnackbar">
        <v-alert type="error">
          Gist Id Missing!
        </v-alert>
      </v-snackbar>
      <v-snackbar v-model="githubKeySnackbar">
        <v-alert type="error">
          Github Authentication Key Missing!
        </v-alert>
      </v-snackbar>
      <v-snackbar v-model="notifySnackbar">
        <v-alert type="success">
          {{ notifyMessage }}
        </v-alert>
      </v-snackbar>
    </v-main>

    <v-footer app>
      <v-container>
        <v-pagination
          v-model="page"
          :length="pages"
          @input="onPagination"
        />
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
  import { Vue, Component } from "vue-property-decorator";
  import { Unquery, replaceLocationURL } from "unquery";
  import fetch from "unfetch";
  import store from "./plugins/store";
  import Gist from "./plugins/gist";
  import { VDLoader } from "vuetify-decorators";
  import { Persist } from "vue-persist-decorator";

  import Plugin from "./components/Plugin";
  import GistSettings from "./components/GistSettings";

  @Component({
    name: "App",

    components: {
      Plugin,
    },
  })
  class App extends Vue {
    data() {
      return {
        search: "",
        page: 1,
        /** @type {import('./assets/types').WordpressPlugin[]} */
        plugins: [],
        pages: 0,
        favorites: {},
        meh: {},
        gistIdSnackbar: false,
        githubKeySnackbar: false,
        notifySnackbar: false,
        notifyMessage: "",
        isSyncing: false,
      };
    }

    @Persist()
    sync = false;

    onTyping() {
      clearTimeout(this.timeout);
      const that = this;
      this.timeout = setTimeout(function () {
        that.setSearchParam(that.search, 1);
        that.getPlugins(that.search, 1);
      }, 250);
    }
    /**
     * @param {String} search
     * @param {Number} page
     */
    setSearchParam(search, page) {
      let searchParam = Unquery(window.location.search, {
        search: Unquery.string(),
        page: Unquery.number(),
      });
      searchParam.search = search;
      searchParam.page = page;
      replaceLocationURL(searchParam);
    }
    /**
     * @param {String} search
     * @param {Number} page
     */
    @VDLoader({ overlayOptions: { "z-index": 4 } })
    async getPlugins(search, page) {
      /** @type {import('./assets/types').ApiResponse} */
      let response = await (
        await fetch(
          `https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request%5Bpage%5D=${page}&request%5Bsearch%5D=${encodeURI(
            search || ""
          )}`
        )
      ).json();
      this.pages = response.info.pages > 999 ? 999 : response.info.pages;
      this.plugins = response.plugins;
    }
    /** @param {Number} page */
    onPagination(page) {
      this.setSearchParam(this.search, page);
      this.getPlugins(this.search, page);
    }
    onSettings() {
      this.$dialog.show(GistSettings);
    }
    async onUpload(notify = true) {
      const res = await Gist.upload();
      if (res === "keyMissing") {
        this.githubKeySnackbar = true;
        return;
      } else if (res === "idMissing") {
        this.gistIdSnackbar = true;
        return;
      }
      if (notify) {
        this.notifyMessage = "Upload successful!";
        this.notifySnackbar = true;
      }
    }
    async onDownload(notify = true, checkOverwrite = false) {
      const res = await Gist.download(checkOverwrite);
      if (res === "keyMissing") {
        this.githubKeySnackbar = true;
        return;
      } else if (res === "idMissing") {
        this.gistIdSnackbar = true;
        return;
      }
      if (res === "overwrite") {
        this.syncWarning();
        return;
      }
      if (notify) {
        this.notifyMessage = "Download successful!";
        this.notifySnackbar = true;
      }
    }
    async onAutoUpload() {
      if (this.sync) {
        this.isSyncing = true;
        await this.onUpload(false);
        this.syncDone();
      }
    }
    async onAutoDownload() {
      if (this.sync) {
        this.isSyncing = true;
        await this.onDownload(false, true);
        this.syncDone();
      }
    }
    async syncWarning() {
      await this.$dialog.warning({
        title: "Warning",
        text: "Your Gist settings are different from your local settings!",
        persistent: true,
        actions: {
          download: {
            text: "Download from Gist",
            color: "error",
            handle: () => {
              this.onDownload();
            },
          },
          disable: {
            text: "Disable Sync",
            color: "error",
            handle: () => {
              this.sync = false;
            },
          },
          upload: {
            text: "Upload to Gist",
            color: "error",
            handle: () => {
              this.onUpload();
            },
          },
        },
      });
    }
    syncDone() {
      const that = this;
      setTimeout(() => {
        that.isSyncing = false;
      }, 250);
    }

    mounted() {
      store.defaults({ WPFavorites: [], WPMeh: [] });

      store.get("WPFavorites").forEach((favorite) => {
        this.favorites[favorite] = true;
      });

      store.get("WPMeh").forEach((meh) => {
        this.meh[meh] = true;
      })

      let searchParam = Unquery(window.location.search, {
        search: Unquery.string(),
        page: Unquery.number(),
      });

      if (searchParam.search) this.search = searchParam.search;
      if (searchParam.page) this.page = searchParam.page;

      this.getPlugins(this.search, this.page);

      this.onAutoDownload();
    }
  }
  export default App;
</script>

<style lang="scss" scoped>
@import "../node_modules/@mdi/font/scss/_variables.scss";

.v-footer .container {
  padding: 0;
}

.v-snack::v-deep {
  .v-snack__content {
    padding: 0;
    min-width: 100%;

    .v-alert {
      margin-bottom: 0;
    }
  }
}

.v-application::v-deep .v-dialog__content--active .v-dialog-wrapper {
  .v-toolbar.warning {
    & ~ .v-card__text {
      text-align: center;
    }

    & ~ .v-card__actions {
      flex-direction: column-reverse;
    }
  }
}

.vue-toggles::v-deep {
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }

  .text {
    &:before {
      display: inline-block;
      font: normal normal normal 24px/1 "Material Design Icons";
      font-size: 19px;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      vertical-align: bottom;
    }

    &:first-of-type:before {
      content: #{'"\\' + map-get($mdi-icons, "sync") + '"'};
    }

    &:last-of-type:before {
      content: #{'"\\' + map-get($mdi-icons, "sync-off") + '"'};
    }
  }

  &.syncing {
    .text:first-of-type:before {
      animation: rotation 1s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  }
}
</style>

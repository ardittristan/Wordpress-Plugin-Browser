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
      <v-btn
        icon
        @click="onUpload"
      >
        <v-icon>
          mdi-upload
        </v-icon>
      </v-btn>
      <v-btn
        icon
        @click="onDownload"
      >
        <v-icon>
          mdi-download
        </v-icon>
      </v-btn>
      <v-btn
        icon
        @click="onSettings"
      >
        <v-icon>
          mdi-cog
        </v-icon>
      </v-btn>
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
            />
          </v-col>
        </v-row>
      </v-container>
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
  import { Unquery, replaceLocationURL } from "unquery";
  import axios from "axios";
  import store from "./plugins/store";

  import Plugin from "./components/Plugin";
  import GistSettings from "./components/GistSettings";

  export default {
    name: "App",

    components: {
      Plugin,
    },

    data: () => ({
      search: "",
      page: 1,
      /** @type {import('./assets/types').WordpressPlugin[]} */
      plugins: [],
      pages: 0,
      favorites: {},
    }),

    methods: {
      onTyping() {
        clearTimeout(this.timeout);
        const that = this;
        this.timeout = setTimeout(function () {
          that.setSearchParam(that.search, 1);
          that.getPlugins(that.search, 1);
        }, 250);
      },
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
      },
      /**
       * @param {String} search
       * @param {Number} page
       */
      async getPlugins(search, page) {
        /** @type {import('./assets/types').ApiResponse} */
        let response = (
          await axios.get(
            `https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request%5Bpage%5D=${page}&request%5Bsearch%5D=${encodeURI(
              search || ""
            )}`
          )
        ).data;
        this.pages = response.info.pages > 999 ? 999 : response.info.pages;
        this.plugins = response.plugins;
      },
      /** @param {Number} page */
      onPagination(page) {
        this.setSearchParam(this.search, page);
        this.getPlugins(this.search, page);
      },
      onSettings() {
        this.$dialog.show(GistSettings);
      },
      onUpload() {},
      onDownload() {},
    },

    mounted() {
      store.defaults({ WPFavorites: [] });

      store.get("WPFavorites").forEach((favorite) => {
        this.favorites[favorite] = true;
      });

      let searchParam = Unquery(window.location.search, {
        search: Unquery.string(),
        page: Unquery.number(),
      });

      if (searchParam.search) this.search = searchParam.search;
      if (searchParam.page) this.page = searchParam.page;

      this.getPlugins(this.search, this.page);
    },
  };
</script>

<style lang="scss" scoped>
.v-footer .container {
  padding: 0;
}
</style>

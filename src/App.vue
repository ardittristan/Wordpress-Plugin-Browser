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
            <plugin :plugin="plugin" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app>
      pagenav
    </v-footer>
  </v-app>
</template>

<script>
  import { Unquery, replaceLocationURL } from "unquery";
  import axios from "axios";

  import Plugin from "./components/Plugin";

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
    }),

    methods: {
      onTyping() {
        clearTimeout(this.timeout);
        var self = this;
        this.timeout = setTimeout(function () {
          self.searchFunction();
        }, 250);
      },
      searchFunction() {
        let searchParam = Unquery(window.location.search, {
          search: Unquery.string(),
          page: Unquery.number(),
        });
        searchParam.search = this.search;
        searchParam.page = 1;
        replaceLocationURL(searchParam);
        this.getPlugins(this.search, this.page);
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
        this.pages = response.info.pages;
        this.plugins = response.plugins;
      },
    },

    mounted() {
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

<template>
  <v-card class="mx-auto plugin-card">
    <v-list-item>
      <a
        :href="pluginUrl"
        target="_blank"
        class="avatar-wrapper"
      >
        <v-list-item-avatar
          tile
          size="120"
        >

          <v-img :src="plugin.icons['1x']" />

        </v-list-item-avatar>
      </a>
      <v-list-item-content>
        <v-container style="padding: 4px;">
          <a
            :href="pluginUrl"
            target="_blank"
          >
            <v-list-item-title :title="decode(plugin.name)">
              {{ decode(plugin.name) }}
            </v-list-item-title>
          </a>
          <Stars
            :rating="plugin.rating"
            :reviews="plugin.num_ratings"
          />
          <v-subheader v-snip="3">
            {{ decode(plugin.short_description) }}
          </v-subheader>
        </v-container>
      </v-list-item-content>
    </v-list-item>
    <v-card-actions>
      <div>
        <v-icon small>
          mdi-account
        </v-icon>
        &nbsp;
        <span
          class="card-sub-text"
          v-html="plugin.author"
        />
      </div>
      <div>
        <v-icon small>
          mdi-chart-timeline-variant
        </v-icon>
        &nbsp;
        <span class="card-sub-text">
          {{ commaNumber(plugin.active_installs) }}+ active installations
        </span>
      </div>
      <div>
        <v-icon dense>
          mdi-wordpress
        </v-icon>
        &nbsp;
        <span class="card-sub-text">
          Tested with {{ plugin.tested }}
        </span>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { decode } from "html-entities";
  import commaNumber from "comma-number";

  import Stars from "./Stars";

  export default {
    components: {
      Stars,
    },

    props: {
      plugin: {
        type: Object,
        required: true,
      },
    },

    computed: {
      pluginUrl() {
        return `https://wordpress.org/plugins/${this.plugin.slug}` || "";
      },
    },

    methods: {
      decode(html) {
        return decode(html);
      },
      commaNumber(num) {
        return commaNumber(num);
      },
    },
  };
</script>

<style lang="scss" scoped>
.plugin-card {
  .v-list-item__content {
    align-self: baseline;
    margin-left: 16px;

    a {
      text-decoration: none;
    }

    .v-subheader {
      padding: 0;
      font-size: 0.925em;
    }
  }

  .v-list-item__avatar:first-child {
    margin-right: 0;
  }

  .v-card__actions {
    display: grid;
    grid-template:
      "top top"
      / auto 1fr;
    grid-column-gap: 1.8em;
    border-top: solid 2px #121212;

    & > div:first-of-type {
      grid-area: top;
    }

    .card-sub-text::v-deep {
      font-size: 0.85em;
      vertical-align: middle;

      a {
        text-decoration: none;
        color: inherit;
      }
    }

    .mdi-wordpress {
      color: #1e1e1e;
      background: radial-gradient(circle, #fff 56%, #0000 58%);
    }
  }
}
</style>

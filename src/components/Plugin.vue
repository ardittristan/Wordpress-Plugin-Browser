<template>
  <v-card class="mx-auto plugin-card">
    <v-list-item>
      <a
        :href="`https://wordpress.org/plugins/${this.plugin.slug}/`"
        target="_blank"
        class="avatar-wrapper"
      >
        <v-list-item-avatar
          tile
          size="120"
        >
          <v-img :src="plugin.icons['1x'] || plugin.icons['2x'] || plugin.icons['svg'] || plugin.icons['default']" />
        </v-list-item-avatar>
      </a>
      <v-list-item-content>
        <v-container style="padding: 4px;">
          <a
            :href="`https://wordpress.org/plugins/${this.plugin.slug}/`"
            target="_blank"
          >
            <v-list-item-title :title="decode(plugin.name)">
              {{ decode(plugin.name) }}
            </v-list-item-title>
          </a>
          <Stars
            :rating="plugin.rating"
            :reviews="plugin.num_ratings"
            :slug="plugin.slug"
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
      <div>
        <v-btn
          icon
          outlined
          color="primary"
          v-if="isMeh"
          @click="removeMeh"
        >
          <v-icon color="red">
            mdi-close-thick
          </v-icon>
        </v-btn>
        <v-btn
          icon
          outlined
          color="primary"
          v-else
          @click="addMeh"
        >
          <v-icon>
            mdi-close-outline
          </v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn
          icon
          outlined
          color="primary"
          v-if="isFavorite"
          @click="removeFavorite"
        >
          <v-icon color="red">
            mdi-heart
          </v-icon>
        </v-btn>
        <v-btn
          icon
          outlined
          color="primary"
          v-else
          @click="addFavorite"
        >
          <v-icon>
            mdi-heart-outline
          </v-icon>
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { decode } from "html-entities";
  import commaNumber from "comma-number";
  import store from "../plugins/store";

  import Stars from "./Stars";

  @Component({
    components: {
      Stars,
    },
  })
  class Plugin extends Vue {
    @Prop({ type: Object, required: true }) plugin;
    @Prop({ type: Object, required: true }) favorites;
    @Prop({ type: Object, required: true }) meh;

    data() {
      return {
        isFavorite: false,
        isMeh: false,
      };
    }

    decode(html) {
      return decode(html);
    }
    commaNumber(num) {
      return commaNumber(num);
    }
    addFavorite() {
      this.favorites[this.plugin.slug] = true;
      this.isFavorite = true;
      store.set("WPFavorites", Object.keys(this.favorites));
      this.$emit("callAutoUpload");
    }
    addMeh() {
      this.meh[this.plugin.slug] = true;
      this.isMeh = true;
      store.set("WPMeh", Object.keys(this.meh));
      this.$emit("callAutoUpload");
    }
    removeFavorite() {
      delete this.favorites[this.plugin.slug];
      this.isFavorite = false;
      store.set("WPFavorites", Object.keys(this.favorites));
      this.$emit("callAutoUpload");
    }
    removeMeh() {
      delete this.meh[this.plugin.slug];
      this.isMeh = false;
      store.set("WPMeh", Object.keys(this.meh));
      this.$emit("callAutoUpload");
    }

    mounted() {
      if (this.favorites[this.plugin.slug]) this.isFavorite = true;
      if (this.meh[this.plugin.slug]) this.isMeh = true;
    }
  }
  export default Plugin;
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
      "top top meh fav"
      ". . meh fav" / auto 1fr auto auto;
    grid-column-gap: 1em;
    border-top: solid 2px #121212;

    & > div {
      &:first-of-type {
        grid-area: top;
      }
      &:nth-last-of-type(2) {
        grid-area: meh;
        margin-right: -0.75em;
      }
      &:last-of-type {
        grid-area: fav;
      }
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

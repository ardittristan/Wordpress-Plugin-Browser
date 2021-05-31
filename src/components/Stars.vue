<template>
  <div class="review">
    <v-icon dense>
      {{ getStar(rating, 15, 5) }}
    </v-icon>
    <v-icon dense>
      {{ getStar(rating, 35, 25) }}
    </v-icon>
    <v-icon dense>
      {{ getStar(rating, 55, 45) }}
    </v-icon>
    <v-icon dense>
      {{ getStar(rating, 75, 65) }}
    </v-icon>
    <v-icon dense>
      {{ getStar(rating, 95, 85) }}
    </v-icon>
    <v-subheader v-if="slug">
      (<a
        :href="`https://wordpress.org/support/plugin/${slug}/reviews/`"
        target="_blank"
      >{{reviews}}</a>)
    </v-subheader>
    <v-subheader v-else>
      ({{reviews}})
    </v-subheader>
  </div>
</template>

<script>
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component()
  class Stars extends Vue {
    @Prop({ type: Number, default: 0 }) rating;
    @Prop({ type: Number, default: 0 }) reviews;
    @Prop({ type: String, required: false }) slug;

    /**
     * @param {Number} rating
     * @param {Number} full
     * @param {Number} half
     */
    getStar(rating, full, half) {
      if (rating >= full) return "mdi-star";
      if (rating >= half) return "mdi-star-half-full";
      return "mdi-star-outline";
    }
  }
  export default Stars;
</script>

<style lang="scss" scoped>
.review {
  display: flex;
  padding: 4px 0;

  .v-subheader {
    padding: 0 4px;
    font-size: 0.8rem;
    height: unset;

    a {
      color: inherit;
      text-decoration: none;
    }
  }

  .mdi-star {
    color: var(--v-warning-darken1);
  }

  .mdi-star-outline {
    color: var(--v-primary-base);
  }

  .mdi-star-half-full {
    background: linear-gradient(
      90deg,
      var(--v-warning-darken1) 50%,
      var(--v-primary-base) 50%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>

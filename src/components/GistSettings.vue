<template>
  <DialogCard
    :actions="actions"
    title="Gist Sync Settings"
  >
    <!-- <v-tooltip
      v-model="snackbar"
      top
      color="red"
    >
      <template v-slot:activator="{}"> -->
    <v-text-field
      v-model="githubKey"
      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPass ? 'text' : 'password'"
      @click:append="showPass = !showPass"
      filled
      dense
      persistent-hint
      hint="Get your github authentication key here"
    >
      <template v-slot:message="{ message, key }">
        <a
          href="https://github.com/settings/tokens/new?description=Wordpress%20Plugin%20Browser&scopes=gist"
          v-html="message"
          target="_blank"
        ></a>
      </template>
      <template v-slot:label>
        Github Authentication Key <v-icon dense>mdi-account-lock</v-icon>
      </template>
    </v-text-field>
    <!-- </template>
      <span>Github Authentication Key Missing!</span>
    </v-tooltip> -->
    <!-- <v-spacer />
    <v-text-field
      v-model="gistId"
      filled
      dense
      persistent-hint
      hint="Create a new gist"
    >
      <template v-slot:message="{ message, key }">
        <a
          href="#"
          v-html="message"
          @click="createGist"
        ></a>
      </template>
      <template v-slot:label>
        Gist Id <v-icon dense>mdi-github</v-icon>
      </template>
    </v-text-field> -->
  </DialogCard>
</template>

<script>
  import store from "../plugins/store";

  export default {
    layout: "gist",

    data: () => ({
      githubKey: "",
      gistId: "",
      snackbar: false,
      showPass: false,
    }),

    computed: {
      actions() {
        return {
          cancel: {
            text: "Cancel",
          },
          save: {
            text: "Save",
            handle: () => {
              this.save();
            },
          },
        };
      },
    },

    methods: {
      save() {
        store.set("githubKey", this.githubKey);
        // store.set("gistId", this.gistId);
      },
      // createGist() {
      //   if (this.githubKey.length === 0) {
      //     this.snackbar = true;
      //     setTimeout(() => {
      //       this.snackbar = false;
      //     }, 5000);
      //     return;
      //   }
      // },
    },

    mounted() {
      store.defaults({ githubKey: "" /* gistId: "" */ });
      this.githubKey = store.get("githubKey");
      // this.gistId = store.get("gistId");
    },
  };
</script>

<!--
<style lang="scss" scoped>
.spacer {
  padding: 8px;
}
</style>
-->

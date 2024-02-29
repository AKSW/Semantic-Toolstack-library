<template>
  <v-card color="basil">
    <v-tabs
      v-model="tab"
      bg-color="transparent"
      color="basil"
      grow
      @change="onTabChange"
    >
      <v-tab href="#tools" value="#tools">Tools</v-tab>
      <v-tab href="#tags" value="#tags">Tags</v-tab>
      <v-tab href="#projects" value="#projects">Projects</v-tab>
    </v-tabs>

    <v-btn
      prepend-icon="mdi-plus"
      block
      @click="redirectToPage"
    >
      <template v-slot:prepend>
        <v-icon></v-icon>
      </template>
      Add
    </v-btn>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="#tools">
          <Toollist @update:hash="removeHash" />
        </v-window-item>

        <v-window-item value="#tags">
          <Taglist @update:hash="removeHash" />
        </v-window-item>

        <v-window-item value="#projects">
          <Projectlist @update:hash="removeHash" />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        tab: "",
      }
    },
    watch: {
      // Watch for changes in the hash and update the tab accordingly
      '$route.hash': {
        immediate: true,
        handler(newHash) {
          // Ensure newHash is treated as a string
          const hashString = String(newHash);
          this.tab = hashString || '#tools'; // Default to first tab if no hash
        },
      },
      // Watch the tab and update the URL hash accordingly
      tab(newVal) {
        if (newVal) {
          this.$router.push({ hash: String(newVal) }).catch(err => {});
        }
      },
    },
    methods: {
      onTabChange(newVal) {
        this.tab = String(newVal);
      },
      redirectToPage() {
        const router = this.$router;
        var path = "";
        switch (this.tab) {
          case "#tools":
            path = "/manageTool";
            break;
          case "#tags":
            path = "/manageTag";
            break;
          case "#projects":
            path = "/manageProject";
            break;
        }
        this.removeHash();
        router.push(path)
      },
      removeHash() {
        this.tab = '';
      },
    },
  }
</script>

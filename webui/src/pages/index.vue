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
          <Toollist />
        </v-window-item>

        <v-window-item value="#tags">
          <Taglist />
        </v-window-item>

        <v-window-item value="#projects">
          projects
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
            path = "/addTool";
            break;
          case "#tags":
            path = "/addTag";
            break;
          case "#projects":
            path = "/addProject";
            break;
        }
        this.tab = '';
        router.push(path)
      },
    },
  }
</script>

<template>
  <v-card color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold text-h2 text-basil">
        Semantic Toolstack Library
      </h1>
    </v-card-title>
    <v-tabs
      v-model="tab"
      bg-color="transparent"
      color="basil"
      grow
    >
      <v-tab value="tools">Tools</v-tab>
      <v-tab value="tags">Tags</v-tab>
      <v-tab value="projects">Projects</v-tab>
    </v-tabs>

    <v-btn
      prepend-icon="mdi-plus"
      block
    >
      <template v-slot:prepend>
        <v-icon></v-icon>
      </template>
      Add
    </v-btn>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="tools">
          <Toollist />
        </v-window-item>

        <v-window-item value="tags">
          <Taglist />
        </v-window-item>

        <v-window-item value="projects">
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
        tab: "tools",
      }
    },
  }
</script>

<template>
  <v-card color="basil">
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
      @click="redirectToPage"
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
  import { useRoute, useRouter } from 'vue-router'

  export default {
    data () {
      return {
        tab: "tools",
      }
    },
    setup() {
      const router = useRouter()

      function redirectToPage() {
        // Replace '/your-path' with the path you want to navigate to
        router.push('/addproject')
      }

      return { redirectToPage }
    },
  }
</script>

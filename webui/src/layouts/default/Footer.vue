<template>
  <v-footer
    class="bg-indigo-lighten-1 text-center d-flex flex-column"
  >
    <div>
      <v-btn
        class="mx-4"
        icon="mdi-github"
        variant="text"
        @click="openInNewTab"
      ></v-btn>
    </div>

    <div class="pt-0">
      dummy
    </div>

    <v-divider></v-divider>

    <div>
      {{ new Date().getFullYear() }} — <strong>InfAI</strong>
    </div>
  </v-footer>
</template>
<script>
  export default {
    methods: {
      openInNewTab() {
        const url = 'https://github.com/AKSW/Semantic-Toolstack-library';
        window.open(url, '_blank');
      }
    },
  }
</script>

<template>
  <v-app>
    <DefaultBar />
    <br>
    <DefaultView />
    <br>
    <DefaultFooter />
  </v-app>
</template>

<script setup>
  import DefaultBar from './default/AppBar.vue'
  import DefaultView from './default/View.vue'
  import DefaultFooter from './default/Footer.vue'
</script>

<template>
  <v-card
    class="mx-auto"
  >
    <v-list>
      <v-list-subheader>Tonal Variant</v-list-subheader>

      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        :color="item.color"
        variant="tonal"
      >
        <v-list-item-title v-text="item.label"></v-list-item-title>
        Group: {item.group}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      items: [
        { id: '1', color: 'white', label: "CLI", group: "test" },
        { id: '2', color: 'grey', label: "Other", group: "test" },
      ],
    }),
  }
</script>

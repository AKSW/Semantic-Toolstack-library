<template>
  <v-card
    class="mx-auto"
  >
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        @click="open(item)"
      >
        <template v-slot:prepend>
          <div :style="{ backgroundColor: item.color }" class="colorbox">
          </div>
        </template>
        <v-list-item-title v-text="item.label"></v-list-item-title>
        Group: {{item.group}}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  import { readResources } from '@/utils/helper';
  import { useRouteDataStore } from '@/store/app'
  import { Tag } from '@/models/Tag'

  export default {
    data: () => ({
      items: [],
    }),
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const data = await readResources("tags");
          console.log("Data return: ", data, "type:", typeof data);
          this.items = Tag.transformFromSPARQL(data); // Update the items data property with the response
        } catch (error) {
          console.error("There was an error fetching the data:", error);
        }
      },
      open(item) {
        console.log(item);

        const store = useRouteDataStore()
        store.setTag(item)

        // Assuming you're using Vue Router for navigation
        this.$router.push({ path: '/addTag' });
      }
    },
  }
</script>

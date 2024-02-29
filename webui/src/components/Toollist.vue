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
          <div>
            <img :src="item.logo" alt="Logo" class="colorbox">
          </div>
        </template>
        <v-list-item-title v-text="item.label"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  import { readResources } from '@/utils/helper';
  import { useRouteDataStore } from '@/store/app'
  import { Tool } from '@/models/Tool'

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
          const data = await readResources("tools");
          console.log("Data return: ", data, "type:", typeof data);
          this.items = Tool.transformFromSPARQL(data); // Update the items data property with the response
        } catch (error) {
          console.error("There was an error fetching the data:", error);
        }
      },
      open(item) {
        console.log(item);

        const store = useRouteDataStore()
        store.setTool(item)

        this.$emit('update:hash');
        this.$router.push('/manageTool');
      }
    },
  }
</script>

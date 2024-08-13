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
  import { readResources } from '@/utils/sparql';
  import { useRouteDataStore } from '@/store/app'
  import { Tool, Repository } from '@/models/Tool'

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
          var tools = Tool.transformFromSPARQL(data); // Update the items data property with the response

          // load repos and assign them
          const data2 = await readResources("repositories", );
          console.log("repos return: ", data2, "type:", typeof data2);
          var repos = Repository.transformFromSPARQL(data2);
          for (var repo of repos) {
            var tool = tools.find((el, i) => {
              return repo.id === el.repository.id;
            });
            tool.repository = repo;
          }

          this.items = tools;
          console.log("all tools: ", this.items);
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

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
        <v-list-item-title>
          <a :href="item.page" target="_blank">
            {{item.label}}
          </a>
        </v-list-item-title>
        Start date: {{item.startDate}}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  import { readResources } from '@/utils/sparql';
  import { useRouteDataStore } from '@/store/app'
  import { Project } from '@/models/Project'

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
          const data = await readResources("projects");
          console.log("Data return: ", data, "type:", typeof data);
          this.items = Project.transformFromSPARQL(data); // Update the items data property with the response
        } catch (error) {
          console.error("There was an error fetching the data:", error);
        }
      },
      open(item) {
        console.log(item);

        const store = useRouteDataStore()
        store.setProject(item)

        this.$emit('update:hash');
        this.$router.push('/manageProject');
      }
    },
  }
</script>

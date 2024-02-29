<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
      v-model="formdata.label"
      label="Name"
    ></v-text-field>

    <v-text-field
      v-model="formdata.repoURL"
      label="Repository URL"
      :rules="URLRule"
    ></v-text-field>

    <v-select
      v-model="formdata.tags"
      :items="tags"
      label="Tags"
      multiple
      :return-object="true"
      @change="updateChipColor"
      :item-value="item => item"
    >
      <template #selection="{ item, index }">
        <v-chip
          :key="index"
          :color="item.value.color"
        >
          {{ item.title }}
        </v-chip>
      </template>
    </v-select>

    <v-checkbox
      v-model="formdata.aksw"
      label="Is AKSW related?">
    </v-checkbox>

    <v-checkbox
      v-model="formdata.autoUpdate"
      label="Should auto update metadata from repo?">
    </v-checkbox>

    <v-select
      v-model="formdata.projects"
      :items="projects"
      chips
      label="Used in projects"
      multiple
      :return-object="true"
      :item-value="item => item"
    ></v-select>

    <v-textarea
      label="Comment"
      v-model="formdata.comment"
      clearable
      clear-icon="mdi-close-circle">
    </v-textarea>

    <v-text-field
      v-model="formdata.logo"
      label="Logo URL"
      :rules="URLRule"
    ></v-text-field>

    <v-text-field
      v-model="formdata.documentationPage"
      label="Documentation URL"
      :rules="URLRule"
    ></v-text-field>
  </v-form>
  <br>
  <div v-show="showRepoDetails">
    <h1>Details from Repository</h1>
    <repository-form
      ref="childFormRef"
      :receivedValue="formdata.repoIRI"
    ></repository-form>
  </div>
  <v-btn
    block
    class="mt-2"
    prepend-icon="mdi-reload"
    @click="loadRepositoryDetails">
    <template v-slot:prepend>
      <v-icon color="blue"></v-icon>
    </template>
    Reload details of repository
  </v-btn>
  <br>
  <br>
</template>

<script>
  import { useRouteDataStore, useSelectorStore } from '@/store/app'
  import { Tool } from '@/models/Tool'
  import { Tag } from '@/models/Tag'
  import { Project } from '@/models/Project'
  import { compileTemplate } from 'vue/compiler-sfc';
  import { readResources, triggerService } from '@/utils/helper';

  export default {
    props: {
      initialFormData: {
        type: Object,
        default: () => ({
          id: '',
          label: "",
          repoURL: "",
          repoIRI: "",
          tags: [],
          aksw: false,
          autoUpdate: false,
          projects: [],
          comment: "",
          logo: "",
          created: "",
          modified: "",
          documentationPage: "",
        }),
      },
    },
    data: () => ({
      formdata: {
        id: '',
        label: "",
        repoURL: "",
        repoIRI: "",
        tags: [],
        aksw: false,
        autoUpdate: false,
        projects: [],
        comment: "",
        logo: "",
        created: "",
        modified: "",
        documentationPage: "",
      },
      URLRule: [
        v => !!v || 'URL is required', // Checks if the value is not empty
        v => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v) || 'Please enter a valid URL',
      ],
      tags: [],
      projects: [],
    }),
    computed: {
      showRepoDetails() {
        if (!this.formdata.repoURL || this.formdata.repoURL == "")
          return false;
        return true;
      },
    },
    methods: {
      getTool() {
        const store = useSelectorStore();
        //prepare tags
        var choosen = this.formdata.tags.map(item2 => {return item2.title});
        var filtered = store.tags.filter(item => {return choosen.includes(item.label)}).map(item3 => item3.id);
        console.log(this.formdata.tags, choosen, filtered)
        //prepare projects
        choosen = this.formdata.projects.map(item2 => {return item2.title});
        var filtered2 = store.projects.filter(item => {return choosen.includes(item.label)}).map(item3 => item3.id);
        console.log(this.formdata.projects, choosen, filtered2)

        return new Tool(
          this.formdata.label,
          this.formdata.repoURL,
          filtered,
          this.formdata.aksw,
          this.formdata.autoUpdate,
          filtered2,
          this.formdata.comment,
          this.formdata.logo,
          this.formdata.created,
          (new Date()).toISOString().substring(0, 10),
          this.formdata.documentationPage,
          this.formdata.id,
          this.formdata.repoIRI,
        );
      },
      async loadRepositoryDetails() {
        await triggerService(this.formdata.repoIRI);
        this.$refs.childFormRef.loadRepository();
      },
      updateFormData(newData) {
        const store = useSelectorStore();
        var temp = { ...newData };
        console.log(store, temp);

        // handle tags, projects and repository
        if (temp.tags.length > 0 && temp.tags[0].title == undefined) {
          temp.tags = store.tags.filter(item => {
            return temp.tags.includes(item.id)
          }).map(item => {
            return {title: item.label, color: item.color};
          });
        }
        if (temp.projects.length > 0 && temp.projects[0].title == undefined) {
          temp.projects = store.projects.filter(item => {
            return temp.projects.includes(item.id)
          }).map(item => {
            return {title: item.label};
          });
        }
        if (temp.repository && typeof temp.repository == 'object' && temp.repository.page) {
          temp.repoURL = temp.repository.page;
          temp.repoIRI = temp.repository.id;
        }

        this.formdata = temp;
        this.$emit('update:formdata', newData);
      },
      updateChipColor(selectedItems) {
        // This method is triggered when the selection changes.
        // If you need to perform additional actions on color change, implement here.
        console.log(selectedItems);
      },
    },
    async mounted() {
      // read data for selectors
      var data = await readResources("tags");
      console.log("Data return: ", data, "type:", typeof data);
      var localTags = Tag.transformFromSPARQL(data);
      this.tags = localTags.map(item => {return {title: item.label, color: item.color}});
      console.log("tags for selector: ", this.tags);
      data = await readResources("projects");
      console.log("Data return: ", data, "type:", typeof data);
      var localProjects = Project.transformFromSPARQL(data);
      this.projects = localProjects.map(item => {return {title: item.label}});;
      // save them in store
      const store2 = useSelectorStore();
      store2.setTags(localTags);
      store2.setProjects(localProjects);

      // fill formdata from store or with inital values
      const store = useRouteDataStore();
      console.log(store.tool);
      if (store.tool.label && store.tool.label !== "") {
        this.updateFormData(store.tool);
        store.clearTool();
      }
      else
        this.updateFormData(this.initialFormData); // Initialize formdata
    },
    watch: {
      formdata(newData) {
        // Emit an event whenever formdata changes
        this.$emit('update:formdata', newData);
      }
    },
  }
</script>

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
      chips
      label="Tags"
      multiple
    ></v-select>

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
</template>

<script>
  import { useRouteDataStore } from '@/store/app'
  import { Tool } from '@/models/Tool'
import { compileTemplate } from 'vue/compiler-sfc';

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
    methods: {
      getTool() {
        return new Tool(
          this.formdata.label,
          this.formdata.repoURL,
          this.formdata.tags.map(item => {return item.id}),
          this.formdata.aksw,
          this.formdata.autoUpdate,
          this.formdata.projects.map(item => {return item.id}),
          this.formdata.comment,
          this.formdata.logo,
          this.formdata.created,
          this.formdata.modified,
          this.formdata.documentationPage,
          this.formdata.id,
          this.formdata.repoIRI,
        );
      },
      updateFormData(newData) {
        var temp = { ...newData };
        if (typeof temp.tags == 'object' && temp.tags.length > 0 && typeof temp.tags[0] == 'string') {
          temp.tags = temp.tags.map(item => {
            return {id: item};
          });
        }
        if (typeof temp.projects == 'object' && temp.projects.length > 0 && typeof temp.projects[0] == 'string') {
          temp.projects = temp.projects.map(item => {
            return {id: item};
          });
        }
        if (temp.repository && typeof temp.repository == 'object' && temp.repository.page) {
          temp.repoURL = temp.repository.page;
          temp.repoIRI = temp.repository.id;
        }

        this.formdata = temp;
        this.$emit('update:formdata', newData);
      },
    },
    mounted() {
      const store = useRouteDataStore();
      console.log(store.tool);
      if (store.tool.label && store.tool.label !== "") {
        this.updateFormData(store.tool);
        store.clearTag();
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

<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
      v-model="formdata.label"
      label="Name"
    ></v-text-field>

    <v-text-field
      v-model="formdata.page"
      label="Page"
      :rules="URLRule"
    ></v-text-field>

    <v-text-field
      v-model="formdata.startDate"
      label="Start date"
      :rules="[dateValidator]"
      placeholder="YYYY-MM-DD or empty"
    ></v-text-field>

    <v-text-field
      v-model="formdata.description"
      label="Description"
    ></v-text-field>

    <v-text-field
      v-model="formdata.duration"
      label="Duration in months"
      :rules="[intValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formdata.client"
      label="Client"
    ></v-text-field>

    <v-text-field
      v-model="formdata.ministry"
      label="Ministry"
    ></v-text-field>

    <v-text-field
      v-model="formdata.identifier"
      label="Identifier"
      placeholder="Like the Förderkennziffer"
    ></v-text-field>

    <v-row>
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="formdata.leadingPerson"
          label="Leading person"
          :rules="URLRule"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" class="d-flex align-center">
        <v-btn small @click="showTurtle" color="primary">
          <v-icon left>mdi-search</v-icon>
          Show turtle of resource
        </v-btn>
      </v-col>
    </v-row>
    <sparql-overlay ref="overlay" />

    <v-checkbox
      v-model="formdata.consortiumLead"
      label="Is InfAI the consortium lead?">
    </v-checkbox>

    <v-text-field
      v-model="formdata.filesLocation"
      label="Files Location"
      :rules="URLRule"
    ></v-text-field>

    <v-text-field
      v-model="formdata.logo"
      label="Logo"
      :rules="URLRule"
    ></v-text-field>

    <v-text-field
      v-model="formdata.repositoryBasis"
      label="Repository basis"
      :rules="URLRule"
    ></v-text-field>
  </v-form>
</template>

<script>
  import { useRouteDataStore } from '@/store/app'
  import { Project } from '@/models/Project'
  import SparqlOverlay from './SparqlOverlay.vue';

  export default {
    components: {
      SparqlOverlay,
    },
    props: {
      initialFormData: {
        type: Object,
        default: () => ({
          label: '',
          page: "",
          startDate: "",
          description: "",
          duration: 0,
          client: "",
          ministry: "",
          identifier: "",
          leadingPerson: "",
          consortiumLead: false,
          filesLocation: "",
          logo: "",
          repositoryBasis: "",
          id: "",
        }),
      },
    },
    data: () => ({
      formdata: {
        label: '',
        page: "",
        startDate: "",
        description: "",
        duration: 0,
        client: "",
        ministry: "",
        identifier: "",
        leadingPerson: "",
        consortiumLead: false,
        filesLocation: "",
        logo: "",
        repositoryBasis: "",
        id: "",
      },
      URLRule: [
        v => !!v || 'URL is required', // Checks if the value is not empty
        v => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v) || 'Please enter a valid URL',
      ],
    }),
    methods: {
      getProject() {
        return new Project(this.formdata.label, this.formdata.page, this.formdata.startDate, this.formdata.description, this.formdata.duration, this.formdata.client, this.formdata.ministry, this.formdata.identifier, this.formdata.leadingPerson, this.formdata.consortiumLead, this.formdata.filesLocation, this.formdata.logo, this.formdata.repositoryBasis, this.formdata.id);
      },
      dateValidator(value) {
        if (!value) return true;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (regex.test(value)) {
          const date = new Date(value);
          const dateIsoString = date.toISOString().substring(0, 10);
          return value === dateIsoString;
        }
        return false;
      },
      intValidator(value) {
        if (!value) {
          return true; // Allows empty values
        }

        // Check if the value is a valid integer string
        const parsed = parseInt(value, 10);

        // Ensure the value is an integer and matches the string format exactly
        if (!Number.isNaN(parsed) && Number.isInteger(parsed) && value.trim() === parsed.toString()) {
          return true;
        }

        return "This is not a valid integer!";
      },
      updateFormData(newData) {
        this.formdata = { ...newData };
        this.$emit('update:formdata', newData);
      },
      showTurtle() {
        this.$refs.overlay.fetchSparqlData(this.formdata.leadingPerson || this.formdata.leadingPerson);
      },
    },
    mounted() {
      const store = useRouteDataStore();
      console.log(store.project);
      if (store.project.label && store.project.label !== "") {
        this.updateFormData(store.project);
        store.clearProject();
      }
      else
        this.updateFormData(this.initialFormData); // Initialize formdata
    },
    watch: {
      formdata(newData) {
        // Emit an event whenever formdata changes
        this.$emit('update:formdata', newData);
      },
    },
  }
</script>

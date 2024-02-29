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
  </v-form>
</template>

<script>
  import { useRouteDataStore } from '@/store/app'
  import { Project } from '@/models/Project'

  export default {
    props: {
      initialFormData: {
        type: Object,
        default: () => ({
          label: '',
          page: "",
          startDate: "",
          id: "",
        }),
      },
    },
    data: () => ({
      formdata: {
        label: '',
        page: "",
        startDate: "",
        id: "",
      },
      URLRule: [
        v => !!v || 'URL is required', // Checks if the value is not empty
        v => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v) || 'Please enter a valid URL',
      ],
    }),
    methods: {
      getProject() {
        return new Project(this.formdata.label, this.formdata.page, this.formdata.startDate, this.formdata.id);
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
      updateFormData(newData) {
        this.formdata = { ...newData };
        this.$emit('update:formdata', newData);
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

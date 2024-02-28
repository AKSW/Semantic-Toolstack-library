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

    <v-date-picker
      show-adjacent-months
      title="Start date"
      v-model="startDate"></v-date-picker>
  </v-form>
</template>

<script>
  import { useRouteDataStore } from '@/store/app'
  import { Project } from '@/models/Project'
  import { transformDateStringToLiteral, transformLiteralToDateString } from '@/utils/helper';

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
      startDate: null,
      URLRule: [
        v => !!v || 'URL is required', // Checks if the value is not empty
        v => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v) || 'Please enter a valid URL',
      ],
    }),
    methods: {
      getProject() {
        return new Project(this.formdata.label, this.formdata.page, this.formdata.startDate, this.formdata.id);
      },
      updateFormData(newData) {
        this.formdata = { ...newData };
        this.$emit('update:formdata', newData);
        if (newData.startDate && newData.startDate !== "")
          this.startDate = transformLiteralToDateString(newData.startDate);
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
      startDate(dateAsString) {
        console.log("New startDate: ", dateAsString);
        if (dateAsString && dateAsString !== "")
          this.formdata.startDate = transformDateStringToLiteral(dateAsString);
      },
    },
  }
</script>

<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
      v-model="formdata.rdfsxXXXxlabel"
      label="Name"
    ></v-text-field>

    <v-color-picker
      v-model="formdata.infai_vxXXXxcolor">
    </v-color-picker>
    <br>

    <v-text-field
      v-model="formdata.infai_vxXXXxgroup"
      label="Group"
    ></v-text-field>
  </v-form>
</template>

<script>
  export default {
    props: {
      initialFormData: {
        type: Object,
        default: () => ({}),
      },
    },
    data: () => ({
      formdata: {
        rdfsxXXXxlabel: '',
        infai_vxXXXxcolor: "",
        infai_vxXXXxgroup: "",
      }
    }),
    created() {
      this.updateFormData(this.initialFormData); // Initialize formdata
    },
    methods: {
      getFormData() {
        return this.formdata;
      },
      updateFormData(newData) {
        this.formdata = { ...newData };
      },
    },
    watch: {
      initialFormData: {
        deep: true,
        handler(newVal) {
          this.updateFormData(newVal)
        },
      },
    },
  }
</script>

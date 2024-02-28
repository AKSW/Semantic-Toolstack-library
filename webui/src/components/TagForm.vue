<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
      v-model="formdata.label"
      label="Name"
    ></v-text-field>

    <v-color-picker
      v-model="formdata.color">
    </v-color-picker>
    <br>

    <v-text-field
      v-model="formdata.group"
      label="Group"
    ></v-text-field>
  </v-form>
</template>

<script>
  import { useRouteDataStore } from '@/store/app'
  import { Tag } from '@/models/Tag'

  export default {
    props: {
      initialFormData: {
        type: Object,
        default: () => ({
          label: '',
          color: "",
          group: "",
          id: "",
        }),
      },
    },
    data: () => ({
      formdata: {
        label: '',
        color: "",
        group: "",
        id: "",
      }
    }),
    methods: {
      getTag() {
        return new Tag(this.formdata.label, this.formdata.color, this.formdata.group, this.formdata.id);
      },
      updateFormData(newData) {
        this.formdata = { ...newData };
        this.$emit('update:formdata', newData);
      },
    },
    mounted() {
      const store = useRouteDataStore();
      console.log(store.tag);
      if (store.tag.label && store.tag.label !== "") {
        this.updateFormData(store.tag);
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

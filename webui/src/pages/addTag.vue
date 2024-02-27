<template>
  <v-alert
    :type="alertType"
    :title="alertTitle"
    v-model="showAlert"
  >
    Tag "{{ rdfsxXXXxlabel }}" in group "{{ infai_vxXXXxgroup }}" and hex color {{ infai_vxXXXxcolor }}
  </v-alert>
  <v-sheet width="90%" class="mx-auto">
    <h1>
      Add new Tag
    </h1>
    <tag-form ref="childFormRef" :initial-form-data="parentFormData"></tag-form>
    <v-btn
      block
      class="mt-2"
      prepend-icon="mdi-check-circle"
      @click="save">
      <template v-slot:prepend>
        <v-icon color="success"></v-icon>
      </template>
      Submit
    </v-btn>
    <br>
    <v-btn
      variant="tonal"
      block
      color="red"
      prepend-icon="mdi-cancel"
      @click="goBack">
      <template v-slot:prepend>
        <v-icon color="cancel"></v-icon>
      </template>
      Cancel
    </v-btn>
  </v-sheet>
</template>

<script>
  import { createResource } from '@/utils/helper';
  import { useRouteDataStore } from '@/store/app'

  var delimiter = "xXXXx";

  export default {
    data: () => ({
      parentFormData: {},//changing this will result in an update on the TagForm form
      showAlert: false,
      alertType: "success",
      alertTitle: "Tag was added",
    }),
    mounted() {
      this.fetchData();
    },
    setup() {
      const router = useRouter();

      function goBack() {
        router.back();
      }

      return { goBack };
    },
    methods: {
      fetchData() {
        const store = useRouteDataStore()
        console.log(store.data)
        this.parentFormData = store.data;
        this.$refs.childFormRef.updateFormData(this.parentFormData)
      },
      save() {
        var data = {};
        Object.entries(this.$refs.childFormRef.getFormData()).forEach(([key, value]) => {
          var keyAsIRI = key.replace(delimiter, ":");
          data[keyAsIRI] = value;
        });
        console.log("data: ", data);
        var response = createResource("tag", data);

        // handle
        if (typeof response !== typeof "string") {//should be the other way around but does not work
          this.alertType = "success";
          this.alertTitle = "Tag was added";
        }
        else {
          this.alertType = "error";
          this.alertTitle = "Failed adding tag";
        }

        // Show the alert
        this.showAlert = true;

        // Set a timer to hide the alert after 10 seconds
        setTimeout(() => {
          this.showAlert = false;
        }, 10000);
      },
    },
  }
</script>

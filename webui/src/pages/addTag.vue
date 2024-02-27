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
    <v-form fast-fail @submit.prevent>
      <v-text-field
        v-model="rdfsxXXXxlabel"
        label="Name"
      ></v-text-field>

      <v-color-picker
        v-model="infai_vxXXXxcolor">
      </v-color-picker>
      <br>

      <v-text-field
        v-model="infai_vxXXXxgroup"
        label="Group"
      ></v-text-field>

      <v-btn
        type="submit"
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
    </v-form>
  </v-sheet>
</template>

<script>
  import { createResource } from '@/utils/helper';

  var delimiter = "xXXXx";

  export default {
    data: () => ({
      rdfsxXXXxlabel: '',
      infai_vxXXXxcolor: "",
      infai_vxXXXxgroup: "",
      showAlert: false,
      alertType: "success",
      alertTitle: "Tag was added",
    }),
    setup() {
      const router = useRouter();

      function goBack() {
        router.back();
      }

      return { goBack };
    },
    methods: {
      save() {
        var data = {};
        Object.entries(this.$data).forEach(([key, value]) => {
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
      }
    }
  }
</script>

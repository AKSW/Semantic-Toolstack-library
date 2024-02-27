<template>
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
        prepend-icon="mdi-check-circle">
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
  var delimiter = "xXXXx";

  export default {
    data: () => ({
      rdfsxXXXxlabel: '',
      infai_vxXXXxcolor: null,
      infai_vxXXXxgroup: "",
    }),
    setup() {
      const router = useRouter();

      function goBack() {
        router.back();
      }

      return { goBack };
    },
  }
</script>

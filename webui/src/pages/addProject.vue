<template>
  <v-sheet width="90%" class="mx-auto">
    <h1>
      Add new Project
    </h1>
    <v-form fast-fail @submit.prevent>
      <v-text-field
        v-model="rdfsxXXXxlabel"
        label="Name"
      ></v-text-field>

      <v-text-field
        v-model="foafxXXXxpage"
        label="Website URL"
        :rules="repoURLRule"
      ></v-text-field>

      <v-date-picker
        show-adjacent-months
        title="Start date"
        v-model="infai_vxXXXxstartDate"></v-date-picker>

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
      foafxXXXxpage: "",
      repoURLRule: [
        v => !!v || 'URL is required', // Checks if the value is not empty
        v => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v) || 'Please enter a valid URL',
      ],
      infai_vxXXXxstartDate: null,
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

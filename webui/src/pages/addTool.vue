<template>
  <v-sheet width="90%" class="mx-auto">
    <h1>
      Add new Tool
    </h1>
    <v-form fast-fail @submit.prevent>
      <v-text-field
        v-model="rdfsxXXXxlabel"
        label="Name"
      ></v-text-field>

      <v-text-field
        v-model="repoURL"
        label="Repository URL"
        :rules="repoURLRule"
      ></v-text-field>

      <v-select
        v-model="infai_vxXXXxtag"
        :items="tags"
        chips
        label="Tags"
        multiple
      ></v-select>

      <v-checkbox
        v-model="infai_vxXXXxAKSW"
        label="Is AKSW related?">
      </v-checkbox>

      <v-checkbox
        v-model="infai_vxXXXxautoUpdate"
        label="Should auto update metadata from repo?">
      </v-checkbox>

      <v-select
        v-model="infai_vxXXXxusedInProject"
        :items="projects"
        chips
        label="Used in projects"
        multiple
      ></v-select>

      <v-textarea
        label="Comment"
        v-model="rdfsxXXXxcomment"
        clearable
        clear-icon="mdi-close-circle">
      </v-textarea>

      <v-text-field
        v-model="foafxXXXxlogo"
        label="Logo URL"
        :rules="repoURLRule"
      ></v-text-field>

      <v-text-field
        v-model="infai_vxXXXxdocumentationPage"
        label="Documentation URL"
        :rules="repoURLRule"
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
      repoURL: '',
      repoURLRule: [
        v => !!v || 'URL is required', // Checks if the value is not empty
        v => /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(v) || 'Please enter a valid URL',
      ],
      infai_vxXXXxtag: [],
      tags: ["CLI", "Workflow", "Test"],
      infai_vxXXXxAKSW: false,
      infai_vxXXXxautoUpdate: false,
      infai_vxXXXxusedInProject: [],
      projects: ["STREAM", "Coypu", "KupferDigital"],
      rdfsxXXXxcomment: "",
      foafxXXXxlogo: "",
      infai_vxXXXxdocumentationPage: "",
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

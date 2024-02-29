<template>
  <v-form
  @submit.prevent
  readonly
  >
    <v-text-field
      v-model="formdata.lastCommit"
      label="Last Commit"
    ></v-text-field>

    <v-text-field
      v-model="formdata.modified"
      label="Modified"
    ></v-text-field>

    <v-text-field
      v-model="formdata.description"
      label="Description"
    ></v-text-field>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col class="d-flex justify-start" cols="4">
                README
              </v-col>
              <v-col
                class="text-grey"
                cols="8"
              >
                <v-fade-transition leave-absolute>
                  <span
                    v-if="expanded"
                    key="0"
                  >
                    Markdown
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-container>
            <div v-html="renderedMarkdown"></div>
          </v-container>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <br>

    <v-text-field
      v-model="formdata.mainContributorName"
      label="Main contributor name"
    ></v-text-field>

    <v-text-field
      v-model="formdata.mainContributorIRI"
      label="Main contributor IRI"
    ></v-text-field>

    <v-text-field
      v-model="formdata.latestRelease"
      label="Latest release"
    ></v-text-field>

    <v-text-field
      v-model="formdata.language"
      label="Language"
    ></v-text-field>

    <v-text-field
      v-model="formdata.meta"
      label="Metadata"
    ></v-text-field>

    <v-text-field
      v-model="formdata.license"
      label="License"
    ></v-text-field>
  </v-form>
</template>

<script>
  import { useRouteDataStore } from '@/store/app'
  import { Repository } from '@/models/Tool'
  import { readResourceByIRI } from '@/utils/helper';
  import { marked } from 'marked';

  export default {
    props: {
      initialFormData: {
        type: Object,
        default: () => ({
          page: '',
          lastCommit: "",
          modified: "",
          description: "",
          readme: "",
          mainContributorName: "",
          mainContributorIRI: "",
          latestRelease: "",
          language: "",
          meta: "",
          license: "",
          id: "",
        }),
      },
    },
    data: () => ({
      formdata: {
        page: '',
        lastCommit: "",
        modified: "",
        description: "",
        readme: "",
        mainContributorName: "",
        mainContributorIRI: "",
        latestRelease: "",
        language: "",
        meta: "",
        license: "",
        id: "",
      },
      expanded: false,
    }),
    computed: {
      renderedMarkdown() {
        if (!this.formdata.readme || this.formdata.readme == "")
          return "";
        return marked(this.formdata.readme);
      },
    },
    methods: {
      updateFormData(newData) {
        this.formdata = { ...newData };
        this.$emit('update:formdata', newData);
      },
      async loadRepository() {
        console.log("mounted RepositoryForm with id ", this.receivedValue);
        if (this.receivedValue && this.receivedValue !== "") {
          var data = await readResourceByIRI("repository", this.receivedValue);
          console.log(data);
          this.updateFormData(Repository.transformFromSPARQL(data));
        }
        else
          this.updateFormData(this.initialFormData); // Initialize formdata
      },
    },
    mounted() {
      this.loadRepository();
    },
    props: {
      // Define a prop named 'receivedValue'
      receivedValue: {
        type: String, // Specify the type of the prop
        default: '', // Provide a default value (optional)
      },
    },
    watch: {
      receivedValue(newData) {
        this.loadRepository();
      }
    },
  }
</script>

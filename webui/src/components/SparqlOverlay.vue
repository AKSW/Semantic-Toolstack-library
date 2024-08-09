<template>
  <v-dialog v-model="dialog" max-width="80%">
    <v-card>
      <v-card-title class="headline">
        RDF Data for {{ iri }}
      </v-card-title>
      <v-card-text>
        <v-textarea class="language-turtle"
          v-model="turtleData"
          readonly
          rows="10"
          outlined
          label="Turtle Data">
        </v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    endpoint: {
      type: String,
      default: `${import.meta.env.VITE_DB_URL}/${import.meta.env.VITE_DB_DATASET}/`
    },
  },
  data() {
    return {
      dialog: false,
      turtleData: '',
      iri: ""
    };
  },
  watch: {
    iri(newIri) {
      if (newIri) {
        this.fetchSparqlData(newIri);
      }
    },
  },
  methods: {
    async fetchSparqlData(iri) {
      if (this.iri == iri)
        return;
      this.iri = iri;
      const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?predicate ?object
        FROM <http://aksw.org/>
        WHERE {
          <${iri}> ?predicate ?object .
        }
      `;
      const url = `${this.endpoint}?query=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/sparql-results+json',
          },
        });
        const data = await response.json();
        this.turtleData = this.convertToTurtle(iri, data.results.bindings);
        this.dialog = true;
      } catch (error) {
        console.error('Error fetching SPARQL data:', error);
      }
    },
    convertToTurtle(subject, bindings) {
      let turtle = `<${subject}> `;
      bindings.forEach(binding => {
        const predicate = `<${binding.predicate.value}>`;
        const object = binding.object.type === 'uri'
          ? `<${binding.object.value}>`
          : `"${binding.object.value}"`;
        turtle += `\t${predicate} ${object} .\n`;
      });
      return turtle;
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>

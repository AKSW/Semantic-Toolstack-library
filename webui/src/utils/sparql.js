// src/utils/helper.js

import { variable } from '@rdfjs/data-model'
import namespace from '@rdfjs/namespace'
import prefixes from '@zazuko/prefixes/prefixes'
import { INSERT, SELECT, DELETE } from '@tpluscode/sparql-builder'
import { v4 as uuidv4 } from 'uuid';

// Namespaces
const infai_v = namespace('http://infai.org/vocabs/semantictoolstack/')
const infai_d = namespace('http://infai.org/data/semantictoolstack/')
const foaf = namespace(prefixes.foaf)
const dc = namespace('http://purl.org/dc/elements/1.1/')
const dcterms = namespace(prefixes.dcterms)
const rdfs = namespace(prefixes.rdfs)

// Constants
const endpoint = `${import.meta.env.VITE_DB_URL}/${import.meta.env.VITE_DB_DATASET}/`;
const service = import.meta.env.VITE_SERVICE_URL;
const delimiter = "xXXXx";
export { delimiter };


// Model functions

export function getSPARQLLiteralOf(obj, key, datatype) {
  switch (datatype) {
    case "literal":
      return `"${obj[key]}"`;
    case "boolean":
    case "number":
      return `${obj[key]}`;
    case "text":
      return `"""${obj[key]}"""`;
    case "IRI":
      return `<${obj[key]}>`;
    case "IRIs":
      return `${"<"+obj[key].join(">, <")+">"}`;
  }
}


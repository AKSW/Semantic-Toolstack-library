// src/utils/helper.js

import { variable } from '@rdfjs/data-model'
import namespace from '@rdfjs/namespace'
import prefixes from '@zazuko/prefixes/prefixes'
//import expand from '@zazuko/prefixes/expand'
import { INSERT, SELECT } from '@tpluscode/sparql-builder'
import { v4 as uuidv4 } from 'uuid';
//import fetch from 'isomorphic-fetch'

const infai_v = namespace('http://infai.org/vocabs/semantictoolstack/')
const infai_d = namespace('http://infai.org/data/semantictoolstack/')
const foaf = namespace(prefixes.foaf)
const dc = namespace(prefixes.dc)
const dcterms = namespace(prefixes.dcterms)
const rdfs = namespace(prefixes.rdfs)

const endpoint = "http://localhost:3030/resources/";

const delimiter = "xXXXx";
export { delimiter };

// A sample helper function
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Another helper function
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// create resource
export function createResource(type, data) {
  switch (type) {
    case 'tag':
      return createTag(data)
      break;

    default:
      return null;
      break;
  }
}

/*
Insert data {
  infai_d:label2 a rdfs:Resource ;
    rdfs:label "CLI" ;
    infai_v:color "black" ;
    infai_v:group "meta" ;
    .
}
*/
async function createTag(tag) {
  const resource = "http://infai.org/data/semantictoolstack/"+uuidv4();
  var query =
    await INSERT.DATA`<${resource}> a ${rdfs.Resource} ;
      ${rdfs.label} "${tag.label}" ;
      ${infai_v.color} "${tag.color}" ;
      ${infai_v.group} "${tag.group}"
      .
    `
      .build();
  console.log("query: ", query)
  var response = await executeSparqlUpdate(query)
  return response;
}

async function executeSparqlUpdate(query) {
  const headers = {
      "Content-Type": "application/sparql-update",
      "Accept": "application/sparql-results+json"
  };

  try {
      const response = await fetch(endpoint, {
          method: "POST",
          headers: headers,
          body: query
      });
      const data = await response.text();
      console.log("Update return: ", data, "type:", typeof data);
      return data;
  } catch (error) {
      console.error("Error fetching data: ", error);
      return error;
  }
}

export function readResources(type) {
  switch (type) {
    case 'tags':
      return readTags()
      break;

    default:
      return null;
      break;
  }
}

/*
SELECT *
WHERE {
  ?tag a rdfs:Resource ;
  	rdfs:label ?label ;
    infai_v:color ?color ;
    infai_v:group ?group ;
    .
  	FILTER ( ?label != "" )
}
*/
async function readTags() {
  const tag = variable('tag')
  const label = variable('label')
  const color = variable('color')
  const group = variable('group')
  var query =
    await SELECT`${tag} ${label} ${color} ${group}`
      .WHERE`${tag} a ${rdfs.Resource} ;
        ${rdfs.label} ${label} ;
        ${infai_v.color} ${color} ;
        ${infai_v.group} ${group} ;
        .
        FILTER ( ?label != "" )`
      .build();
  console.log("query: ", query)
  var response = await executeSparqlQuery(query)
  return response.results.bindings;
}

async function executeSparqlQuery(query) {
  const headers = {
      "Content-Type": "application/sparql-query",
      "Accept": "application/sparql-results+json"
  };

  try {
      const response = await fetch(endpoint, {
          method: "POST",
          headers: headers,
          body: query
      });
      const data = await response.json();
      console.log("Query return: ", data, "type:", typeof data);
      return data;
  } catch (error) {
      console.error("Error fetching data: ", error);
      return error;
  }
}

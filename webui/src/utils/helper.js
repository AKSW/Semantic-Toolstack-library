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
const dc = namespace(prefixes.dc)
const dcterms = namespace(prefixes.dcterms)
const rdfs = namespace(prefixes.rdfs)

// Constants
const endpoint = "http://localhost:3030/resources/";
const delimiter = "xXXXx";
export { delimiter };

// Another helper function
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// CREATE
// create resource
export function createResource(type, data) {
  switch (type) {
    case 'tag':
      return createTag(data)
      break;
    case 'project':
      return createProject(data)
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

/*
Insert data {
  infai_d:STREAM a rdfs:Resource ;
    rdfs:label "STREAM" ;
    foaf:page <http...> ;
    infai_v:startDate "2024" ;
    .
}
*/
async function createProject(project) {
  const resource = "http://infai.org/data/semantictoolstack/"+uuidv4();
  var query =
    await INSERT.DATA`<${resource}> a ${rdfs.Resource} ;
      ${rdfs.label} "${project.label}" ;
      ${foaf.page} <${project.page}> ;
      ${infai_v.startDate} "${project.startDate}"
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

// READ
export function readResources(type) {
  switch (type) {
    case 'tags':
      return readTags()
      break;
    case 'projects':
      return readProjects()
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
        FILTER ( ${label} != "" )`
      .build();
  console.log("query: ", query)
  var response = await executeSparqlQuery(query)
  return response.results.bindings;
}

/*
SELECT *
WHERE {
  ?project a rdfs:Resource ;
  	rdfs:label ?label ;
    foaf:page ?page ;
    infai_v:startDate ?startDate ;
    .
  	FILTER ( ?label != "" )
}
*/
async function readProjects() {
  const project = variable('project')
  const label = variable('label')
  const page = variable('page')
  const startDate = variable('startDate')
  var query =
    await SELECT`${project} ${label} ${page} ${startDate}`
      .WHERE`${project} a ${rdfs.Resource} ;
        ${rdfs.label} ${label} ;
        ${foaf.page} ${page} ;
        ${infai_v.startDate} ${startDate} ;
        .
        FILTER ( ${label} != "" )`
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

// DELETE
// delete resource
export function deleteResource(type, data) {
  switch (type) {
    case 'tag':
      return deleteTag(data)
      break;
    case 'project':
      return deleteProject(data)
      break;

    default:
      return null;
      break;
  }
}

/*
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX infai_v: <http://infai.org/vocabs/semantictoolstack/>

delete {
	?tag a rdfs:Resource;
      rdfs:label ?label ;
      infai_v:color ?color ;
      infai_v:group ?group ;
      .
}
WHERE {
  FILTER ( ?tag = <http://infai.org/data/semantictoolstack/69c081e9-b26c-46c5-b223-95907b2433ce> )
}
*/
async function deleteTag(tagObject) {
  const iri = tagObject.id;
  const tag = variable('tag')
  const label = variable('label')
  const color = variable('color')
  const group = variable('group')
  var query =
    await DELETE`${tag} a ${rdfs.Resource} ;
      ${rdfs.label} ${label} ;
      ${infai_v.color} ${color} ;
      ${infai_v.group} ${group}
      .
    `
    .WHERE`${tag} a ${rdfs.Resource} ;
      ${rdfs.label} ${label} ;
      ${infai_v.color} ${color} ;
      ${infai_v.group} ${group}
      .
      FILTER( ${tag} = <${iri}> )`
    .build();
  console.log("update: ", query)
  var response = await executeSparqlUpdate(query)
  return response;
}

/*
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX infai_v: <http://infai.org/vocabs/semantictoolstack/>

delete {
	?project a rdfs:Resource;
      rdfs:label ?label ;
      foaf:page ?page ;
      infai_v:startDate ?startDate ;
      .
}
WHERE {
  FILTER ( ?project = <http://infai.org/data/semantictoolstack/69c081e9-b26c-46c5-b223-95907b2433ce> )
}
*/
async function deleteProject(projectObject) {
  const iri = projectObject.id;
  const project = variable('project')
  const label = variable('label')
  const page = variable('page')
  const startDate = variable('startDate')
  var query =
    await DELETE`${project} a ${rdfs.Resource} ;
      ${rdfs.label} ${label} ;
      ${foaf.page} ${page} ;
      ${infai_v.startDate} ${startDate}
      .
    `
    .WHERE`${project} a ${rdfs.Resource} ;
      ${rdfs.label} ${label} ;
      ${foaf.page} ${page} ;
      ${infai_v.startDate} ${startDate}
      .
      FILTER( ${project} = <${iri}> )`
    .build();
  console.log("update: ", query)
  var response = await executeSparqlUpdate(query)
  return response;
}

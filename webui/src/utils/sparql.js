// src/utils/sparql.js

import { INSERT, SELECT, DELETE } from '@tpluscode/sparql-builder'
import { v4 as uuidv4 } from 'uuid';
import { Tag } from '@/models/Tag'
import { Project } from '@/models/Project'
import { Tool, Repository } from '@/models/Tool'

// Constants
const endpoint = `${import.meta.env.VITE_DB_URL}/${import.meta.env.VITE_DB_DATASET}/`;


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

function insertBuilder(obj) {
  const resource = obj.constructor.__namespace+uuidv4();

  var ret = `<${obj.id || resource}> a <${obj.constructor.__type.value}> ;\n`;
  for (var key of Object.keys(obj)) {
    if (key !== "id") {
      ret += `<${obj.constructor.__predicateMap[key].value}> ${obj.sparqlSnippet(key)} ;\n`
    }
  }
  return ret;
}

function selectBuilder(obj) {
  var query = ``;
  for (var key of Object.keys(obj)) {
    query += `?${key} `;
  }

  return query;
}

function selectWhereBuilder(obj) {
  // console.log(obj)

  var ret = `?id a <${obj.constructor.__type.value}> ;\n`;
  for (var key of Object.keys(obj)) {
    if (key !== "id") {
      ret += `<${obj.constructor.__predicateMap[key].value}> ?${key} ;\n`
    }
  }
  return ret;
}

export function getResponseValue(item, key, datatypes) {
  function get() {
    if (Object.keys(item).includes(key) && Object.keys(item[key]).includes('value'))
      return item[key].value;
    return ""
  };

  if (datatypes[key] === 'IRI') {
    return (get() === "http://server/unset-base/") ? "" : get()
  }
  else
    return get();
}

// SPARQL

async function executeSparqlUpdate(query) {
  const username = import.meta.env.VITE_DB_USER;
  const password = import.meta.env.VITE_DB_PASSWORD;
  const authHeader = 'Basic ' + btoa(username + ':' + password);
  const headers = {
      "Content-Type": "application/sparql-update",
      "Accept": "application/sparql-results+json",
      'Authorization': authHeader
  };

  try {
      const response = await fetch(endpoint+"update", {
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

async function executeSparqlQuery(query) {
  const headers = {
      "Content-Type": "application/sparql-query",
      "Accept": "application/sparql-results+json"
  };

  try {
      const response = await fetch(endpoint+"query", {
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

// CREATE
export async function createResource(data) {
  var query =
    await INSERT.DATA`${insertBuilder(data)}
      .
    `
      .build();
  console.log("query: ", query)
  var response = await executeSparqlUpdate(query)
  return response;
}

// READ
export async function readResources(type, id = "") {
  var obj;
  switch (type) {
    case 'tags':
      obj = new Tag();
      break;
    case 'projects':
      obj = new Project();
      break;
    case 'tools':
      obj = new Tool();
      break;
    case 'repositories':
      obj = new Repository();
      break;

    default:
      obj = {};
      break;
  }

  // prepare statements
  var myselect = obj.constructor.__select;
  if (myselect === undefined || myselect === "")
    myselect = selectBuilder(obj);
  var mywhere = selectWhereBuilder(obj);
  var filter = "";
  if (id !== "") {
    filter = ` FILTER( ?id = <${id}> ) `;
  }
  var nameFilter = ` FILTER ( ?label != "" ) `;
  if (obj.constructor.__ignoreFilter) {
    nameFilter = "";
  }

  // build query
  var promise = SELECT`${myselect}`
  .WHERE`${mywhere}
    .
    ${nameFilter}
    ${filter}`;
  var grouping = obj.constructor.__group;
  if (grouping !== undefined || grouping === "") {
    promise = promise.GROUP().BY`${grouping}`
  }
  var query = await promise.build();
  console.log("query: ", query)

  // send query
  var response = await executeSparqlQuery(query)
  if (id !== "") {
    if (response.results.bindings.length < 1) {
      console.log("read with iri ", iri, "had no result:", response.results.bindings);
      return null;
    }
  }
  return response.results.bindings;
}

// DELETE
export async function deleteResource(data) {
  var mywhere = selectWhereBuilder(data);

  var query =
    await DELETE`${mywhere}
      .
    `
    .WHERE`${mywhere}
      .
      FILTER( ?id = <${data.id}> )`
    .build();
  console.log("update: ", query)
  var response = await executeSparqlUpdate(query)
  return response;
}


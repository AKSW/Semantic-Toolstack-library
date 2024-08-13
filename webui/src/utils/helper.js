// src/utils/helper.js

import { variable } from '@rdfjs/data-model'
import namespace from '@rdfjs/namespace'
import prefixes from '@zazuko/prefixes/prefixes'
import { INSERT, SELECT, DELETE } from '@tpluscode/sparql-builder'
import { v4 as uuidv4 } from 'uuid';
import { Tag } from '@/models/Tag'
import { Project } from '@/models/Project'
import { Tool, Repository } from '@/models/Tool'

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

// Another helper function
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function triggerService(iri) {
  const url = service+'/updateRepoData/?iri='+iri;

  try {
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }

    const data = await response.json(); // Parse the JSON of the response
    console.log(data); // Log the data
    return data;
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
    return {};
  }
}

// CREATE
// create resource
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

function insertBuilder(obj) {
  console.log(obj)
  const resource = obj.constructor.__namespace+uuidv4();

  var ret = `<${resource}> a <${obj.constructor.__type.value}> ;\n`;
  for (var key of Object.keys(obj)) {
    if (key !== "id") {
      ret += `<${obj.constructor.__predicateMap[key].value}> ${obj.sparqlSnippet(key)} ;\n`
    }
  }
  return ret;
}

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

// READ
export async function readResources(type) {
  var obj;
  switch (type) {
    case 'tags':
      obj = new Tag();
      break;
    case 'projects':
      obj = new Project();
      break;
    case 'tools': // TODO: read Repository afterwards
      obj = new Tool();
      break;
    case 'repositories':
      obj = new Repository();
      break;

    default:
      break;
  }

  var myselect = obj.constructor.__select;
  if (myselect === undefined || myselect === "")
    myselect = selectBuilder(obj);
  var mywhere = selectWhereBuilder(obj);
  var promise = SELECT`${myselect}`
  .WHERE`${mywhere}
    .
    FILTER ( ?label != "" )`;
  var grouping = obj.constructor.__group;
  if (grouping !== undefined || grouping === "") {
    promise = promise.GROUP().BY`${grouping}`
  }
  var query = await promise.build();
  console.log("query: ", query)
  var response = await executeSparqlQuery(query)
  return response.results.bindings;
}

function selectBuilder(obj) {
  var query = ``;
  for (var key of Object.keys(obj)) {
    query += `?${key} `;
  }

  return query;
}

function selectWhereBuilder(obj) {
  console.log(obj)

  var ret = `?id a <${obj.constructor.__type.value}> ;\n`;
  for (var key of Object.keys(obj)) {
    if (key !== "id") {
      ret += `<${obj.constructor.__predicateMap[key].value}> ?${key} ;\n`
    }
  }
  return ret;
}


export function readResourceByIRI(type, iri) {
  switch (type) {
    case 'repository':
      return readRepository(iri)
      break;

    default:
      return null;
      break;
  }
}

/*
SELECT *
WHERE {
  ?repo a rdfs:Resource ;
  	foaf:page ?page ;
    infai_v:lastCommit ?lastCommit ;
    dcterms:modified ?modified ;
    dc:description ?description ;
    infai_v:readme ?readme ;
    infai_v:mainContributor ?mainContributor ;
    infai_v:mainContributorIRI ?mainContributorIRI ;
    infai_v:latestRelease ?latestRelease ;
    infai_v:language ?language ;
    infai_v:meta ?meta ;
    dcterms:license ?license ;
    .
}
*/
async function readRepository(iri) {
  const repo = variable('repo')
  const page = variable('page')
  const lastCommit = variable('lastCommit')
  const modified = variable('modified')
  const description = variable('description')
  const readme = variable('readme')
  const mainContributor = variable('mainContributor')
  const mainContributorIRI = variable('mainContributorIRI')
  const latestRelease = variable('latestRelease')
  const language = variable('language')
  const meta = variable('meta')
  const license = variable('license')
  var query =
    await SELECT`*`
      .WHERE`${repo} a ${rdfs.Resource} ;
        ${foaf.page} ${page} ;
        ${infai_v.lastCommit} ${lastCommit} ;
        ${dcterms.modified} ${modified} ;
        ${dc.description} ${description} ;
        ${infai_v.readme} ${readme} ;
        ${infai_v.mainContributor} ${mainContributor} ;
        ${infai_v.mainContributorIRI} ${mainContributorIRI} ;
        ${infai_v.latestRelease} ${latestRelease} ;
        ${infai_v.language} ${language} ;
        ${infai_v.meta} ${meta} ;
        ${dcterms.license} ${license} ;
        .
        FILTER( ${repo} = <${iri}> )`
      .build();
  console.log("query: ", query)
  var response = await executeSparqlQuery(query)
  if (response.results.bindings.length < 1) {
    console.log("readRepository with iri ", iri, "had no result:", response.results.bindings);
    return null;
  }
  return response.results.bindings[0];
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
    case 'tool':
      return deleteTool(data)
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
  ?project a rdfs:Resource;
    rdfs:label ?label ;
    foaf:page ?page ;
    infai_v:startDate ?startDate ;
    .
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

/*
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX infai_v: <http://infai.org/vocabs/semantictoolstack/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dcterms: <http://purl.org/dc/terms/>

delete {
	?tool a rdfs:Resource ;
  	infai_v:repository ?repositoryIRI ;
    rdfs:label ?label ;
    infai_v:tag ?tag ;
    infai_v:AKSW ?aksw ;
    infai_v:autoUpdate ?autoUpdate ;
    infai_v:usedInProject ?project ;
    rdfs:comment ?comment ;
    foaf:logo ?logo ;
    dcterms:created ?created ;
    dcterms:modified ?modified ;
    infai_v:documentationPage ?documentationPage ;
    .
  ?repositoryIRI a rdfs:Resource ;
	  foaf:page ?repositoryURL ;
    .
}
WHERE {
  ?tool a rdfs:Resource ;
  	infai_v:repository ?repositoryIRI ;
    rdfs:label ?label ;
    infai_v:tag ?tag ;
    infai_v:AKSW ?aksw ;
    infai_v:autoUpdate ?autoUpdate ;
    infai_v:usedInProject ?project ;
    rdfs:comment ?comment ;
    foaf:logo ?logo ;
    dcterms:created ?created ;
    dcterms:modified ?modified ;
    infai_v:documentationPage ?documentationPage ;
    .
  ?repositoryIRI a rdfs:Resource ;
	  foaf:page ?repositoryURL ;
    .
  FILTER ( ?tool = <http://infai.org/data/semantictoolstack/resource1> )
}
*/
async function deleteTool(toolObject) {
  const iri = toolObject.id;
  const tool = variable('tool')
  const repositoryIRI = variable('repositoryIRI')
  const repositoryURL = variable('repositoryURL')
  const label = variable('label')
  const tag = variable('tag')
  const aksw = variable('aksw')
  const autoUpdate = variable('autoUpdate')
  const project = variable('project')
  const comment = variable('comment')
  const logo = variable('logo')
  const created = variable('created')
  const modified = variable('modified')
  const documentationPage = variable('documentationPage')
  var query =
    await DELETE`${tool} a ${rdfs.Resource} ;
      ${infai_v.repository} ${repositoryIRI} ;
      ${rdfs.label} ${label} ;
      ${infai_v.tag} ${tag} ;
      ${infai_v.AKSW} ${aksw} ;
      ${infai_v.autoUpdate} ${autoUpdate} ;
      ${infai_v.usedInProject} ${project} ;
      ${rdfs.comment} ${comment} ;
      ${foaf.logo} ${logo} ;
      ${dcterms.created} ${created} ;
      ${dcterms.modified} ${modified} ;
      ${infai_v.documentationPage} ${documentationPage} ;
      .
      ${repositoryIRI} a ${rdfs.Resource} ;
      ${foaf.page} ${repositoryURL} ;
        .
    `
    .WHERE`${tool} a ${rdfs.Resource} ;
      ${infai_v.repository} ${repositoryIRI} ;
      ${rdfs.label} ${label} ;
      ${infai_v.tag} ${tag} ;
      ${infai_v.AKSW} ${aksw} ;
      ${infai_v.autoUpdate} ${autoUpdate} ;
      ${infai_v.usedInProject} ${project} ;
      ${rdfs.comment} ${comment} ;
      ${foaf.logo} ${logo} ;
      ${dcterms.created} ${created} ;
      ${dcterms.modified} ${modified} ;
      ${infai_v.documentationPage} ${documentationPage} ;
      .
      ${repositoryIRI} a ${rdfs.Resource} ;
        ${foaf.page} ${repositoryURL} ;
        .
      FILTER( ${tool} = <${iri}> )`
    .build();
  console.log("update: ", query)
  var response = await executeSparqlUpdate(query)
  return response;
}

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
    case 'tool':
      return createTool(data)
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

/*
Insert data {
  infai_d:resource1 a rdfs:Resource ;
    infai_v:repository infai_d:repo1 ;
	  rdfs:label "RDF Processing Toolkit" ;
    infai_v:tag infai_d:label1, infai_d:label2 ;
    infai_v:AKSW "true" ;
    infai_v:autoUpdate "true" ;
    infai_v:usedInProject infai_d:STREAM, infai_d:Coypu, infai_d:KupferDigital ;
    rdfs:comment "Claus allmächtiges Tool" ;
    foaf:logo <https://avatars.githubusercontent.com/u/15215821?s=48&v=4> ;
    dcterms:created "22-02-2024" ;
    dcterms:modified "22-02-2024" ;
    infai_v:documentationPage <https://smartdataanalytics.github.io/RdfProcessingToolkit/> ;
    .
}
*/
async function createTool(tool) {
  const resource = "http://infai.org/data/semantictoolstack/"+uuidv4();
  var query =
    await INSERT.DATA`<${resource}> a ${rdfs.Resource} ;
      ${infai_v.repository} <${tool.repository.iri}> ;
      ${rdfs.label} "${tool.label}" ;
      ${infai_v.tag} ${"<"+tool.tags.join(">, <")+">"} ;
      ${infai_v.AKSW} ${tool.aksw} ;
      ${infai_v.autoUpdate} ${tool.autoUpdate} ;
      ${infai_v.usedInProject} ${"<"+tool.projects.join(">, <")+">"} ;
      ${rdfs.comment} """${tool.comment}""" ;
      ${foaf.logo} <${tool.logo}> ;
      ${dcterms.created} "${tool.created}" ;
      ${dcterms.modified} "${tool.modified}" ;
      ${infai_v.documentationPage} <${tool.documentationPage}> ;
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
    case 'tools':
      return readTools()
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

/*
SELECT ?tool ?repositoryURL ?label (GROUP_CONCAT(?tag; SEPARATOR=", ") as ?tags) ?aksw ?autoUpdate (GROUP_CONCAT(?project; SEPARATOR=", ") as ?projects) ?comment ?logo ?created ?modified ?documentationPage
WHERE {
  ?tool a rdfs:Resource ;
  	infai_v:repository ?repositoryURL ;
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
  	FILTER ( ?label != "" )
}
group by ?tool ?repositoryURL ?label ?aksw ?autoUpdate ?comment ?logo ?created ?modified ?documentationPage
*/
async function readTools() {
  const tool = variable('tool')
  const repositoryURL = variable('repositoryURL')
  const label = variable('label')
  const tag = variable('tag')
  const tags = variable('tags')
  const aksw = variable('aksw')
  const autoUpdate = variable('autoUpdate')
  const project = variable('project')
  const projects = variable('projects')
  const comment = variable('comment')
  const logo = variable('logo')
  const created = variable('created')
  const modified = variable('modified')
  const documentationPage = variable('documentationPage')
  var query =
    await SELECT`${tool} ${repositoryURL} ${label} (GROUP_CONCAT(DISTINCT ${tag}; SEPARATOR=", ") as ${tags}) ${aksw} ${autoUpdate} (GROUP_CONCAT(DISTINCT ${project}; SEPARATOR=", ") as ${projects}) ${comment} ${logo} ${created} ${modified} ${documentationPage}`
      .WHERE`${tool} a ${rdfs.Resource} ;
        ${infai_v.repository} ${repositoryURL} ;
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
        FILTER ( ${label} != "" )`
      .GROUP().BY`${tool}) (${repositoryURL}) (${label}) (${aksw}) (${autoUpdate}) (${comment}) (${logo}) (${created}) (${modified}) (${documentationPage}`
      .build();
  console.log("query: ", query)
  var response = await executeSparqlQuery(query)
  return response.results.bindings;
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
  	infai_v:repository ?repositoryURL ;
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
}
WHERE {
  ?tool a rdfs:Resource ;
  	infai_v:repository ?repositoryURL ;
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
  FILTER ( ?tool = <http://infai.org/data/semantictoolstack/resource1> )
}
*/
async function deleteTool(toolObject) {
  const iri = projectObject.id;
  const tool = variable('tool')
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
  // TODO: also delete repository
  var query =
    await DELETE`${tool} a ${rdfs.Resource} ;
      ${infai_v.repository} ${repositoryURL} ;
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
    `
    .WHERE`${tool} a ${rdfs.Resource} ;
        ${infai_v.repository} ${repositoryURL} ;
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
      FILTER( ${tool} = <${iri}> )`
    .build();
  console.log("update: ", query)
  var response = await executeSparqlUpdate(query)
  return response;
}

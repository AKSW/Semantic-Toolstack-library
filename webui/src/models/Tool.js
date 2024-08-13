import { v4 as uuidv4 } from 'uuid';
import namespace from '@rdfjs/namespace'
import prefixes from '@zazuko/prefixes/prefixes'
import mynamespaces from '@/models/namespaces';
import { getSPARQLLiteralOf } from '@/utils/sparql';
const rdfs = namespace(prefixes.rdfs);
const infai_v = namespace(mynamespaces["vocab"]);
const foaf = namespace(prefixes.foaf)
const dcterms = namespace(prefixes.dcterms)
const dc = namespace('http://purl.org/dc/elements/1.1/')

export class Tool {
  constructor(label, repositoryURL, tags, aksw, autoUpdate, projects, comment, logo, created, modified, documentationPage, id = "", repositoryIRI = "", status = "interesting") {
    this.id = id;
    this.label = label;
    var iri = repositoryIRI;
    if (!iri || iri == "")
      iri = "http://infai.org/data/semantictoolstack/"+uuidv4();
    this.repository = new Repository(repositoryURL, iri);
    this.tags = tags;                                 // array of iri strings
    this.aksw = aksw;                                 // boolean
    this.autoUpdate = autoUpdate;                     // boolean
    this.projects = projects;                         // array of iri strings
    this.comment = comment;
    this.logo = logo;
    const now = (new Date()).toISOString().substring(0, 10);
    this.created = created || now;
    this.modified = modified || now;
    this.documentationPage = documentationPage;
    this.status = status;
  }

  static __namespace = mynamespaces["tools"];

  static __type = rdfs.Resource;

  static __datatypes = {
      "label": "literal",
      "repository": "IRI",
      "tags": "IRIs",
      "aksw": "boolean",
      "autoUpdate": "boolean",
      "projects": "IRIs",
      "comment": "text",
      "logo": "IRI",
      "created": "literal",
      "modified": "literal",
      "documentationPage": "IRI",
      "status": "literal"
  };

  static __predicateMap = {
    "label": rdfs.label,
    "repository": infai_v.repository,
    "tags": infai_v.tag,
    "aksw": infai_v.AKSW,
    "autoUpdate": infai_v.autoUpdate,
    "projects": infai_v.usedInProject,
    "comment": rdfs.comment,
    "logo": foaf.logo,
    "created": dcterms.created,
    "modified": dcterms.modified,
    "documentationPage": infai_v.documentationPage,
    "status": infai_v.status
  };

  sparqlSnippet(key) {
    const aggregates = {

    };
    if (key in aggregates) {
      return aggregates[key];
    }
    return getSPARQLLiteralOf(this, key, Tool.__datatypes[key]);
  }

  static __select = `?id ?repositoryIRI ?repository ?label (GROUP_CONCAT(DISTINCT ?tags; SEPARATOR=", ") as ?alltags) ?aksw ?autoUpdate (GROUP_CONCAT(DISTINCT ?projects; SEPARATOR=", ") as ?allprojects) ?comment ?logo ?created ?modified ?documentationPage ?status`;
  static __group = `?id) (?repositoryIRI) (?repository) (?label) (?aksw) (?autoUpdate) (?comment) (?logo) (?created) (?modified) (?documentationPage) (?status`;

  static transformFromSPARQL(response) {
    const modifiedData = response.map(item => {
      return new Tool(
        item.label.value,
        "", //item.repositoryURL.value,
        item.alltags.value.split(", "),
        item.aksw.value === 'true',
        item.autoUpdate.value === 'true',
        item.allprojects.value.split(", "),
        item.comment.value,
        item.logo.value,
        item.created.value,
        item.modified.value,
        item.documentationPage.value,
        item.id.value,
        item.repository.value,
        ((item.status != undefined) ? item.status.value : "interesting"),
      );
    }).sort((a, b) => a.label.localeCompare(b.label));
    return modifiedData;
  }
}

export class Repository {
  constructor(page, id = "", lastCommit = "", modified = "", description = "", readme = "", mainContributorName = "", mainContributorIRI = "", latestRelease = "", language = "", meta = "", license = "") {
    const now = (new Date()).toISOString().substring(0, 10);
    this.id = id;
    this.page = page;
    this.lastCommit = lastCommit;
    this.modified = modified || now;
    this.description = description;
    this.readme = readme;
    this.mainContributorName = mainContributorName;
    this.mainContributorIRI = mainContributorIRI;
    this.latestRelease = latestRelease;
    this.language = language;
    this.meta = meta;
    this.license = license;
  }

  static __namespace = mynamespaces["repositories"];

  static __type = rdfs.Resource;

  static __datatypes = {
      "page": "IRI",
      "lastCommit": "literal",
      "modified": "literal",
      "description": "literal",
      "readme": "text",
      "mainContributorName": "literal",
      "mainContributorIRI": "IRI",
      "latestRelease": "IRI",
      "language": "literal",
      "meta": "literal",
      "license": "literal"
  };

  static __predicateMap = {
    "page": foaf.page,
    "lastCommit": infai_v.lastCommit,
    "modified": dcterms.modified,
    "description": dc.description,
    "readme": infai_v.readme,
    "mainContributorName": infai_v.mainContributor,
    "mainContributorIRI": infai_v.mainContributorIRI,
    "latestRelease": infai_v.latestRelease,
    "language": infai_v.language,
    "meta": infai_v.meta,
    "license": dcterms.license
  };

  sparqlSnippet(key) {
    const aggregates = {

    };
    if (key in aggregates) {
      return aggregates[key];
    }
    return getSPARQLLiteralOf(this, key, Project.__datatypes[key]);
  }

  static transformFromSPARQL(item) {
    if (!item)
      return {};
    return new Repository(
      item.page.value,
      item.repo.value,
      item.lastCommit.value,
      item.modified.value,
      item.description.value,
      item.readme.value,
      item.mainContributor.value,
      item.mainContributorIRI.value,
      item.latestRelease.value,
      item.language.value,
      item.meta.value,
      item.license.value,
    );
  }
}

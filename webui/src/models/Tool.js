import { v4 as uuidv4 } from 'uuid';

export class Tool {
  constructor(label, repositoryURL, tags, aksw, autoUpdate, projects, comment, logo, created, modified, documentationPage, id = "", repositoryIRI = "") {
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
  }

  transformForSPARQL() {
    return {
      "tool": this.id,
      "rdfs:label": this.label,
      "infai_v:repository": this.repository.id,
      "infai_v:tag": "<"+this.tags.join(">, <")+">",
      "infai_v:AKSW": this.aksw,
      "infai_v:autoUpdate": this.autoUpdate,
      "infai_v:usedInProject": "<"+this.projects.join(">, <")+">",
      "rdfs:comment": this.comment,
      "foaf:logo": this.logo,
      "dcterms:created": this.creted,
      "dcterms:modified": this.modified,
      "infai_v:documentationPage": this.documentationPage,
    };
  }

  static transformFromSPARQL(response) {
    const modifiedData = response.map(item => {
      return new Tool(
        item.label.value,
        item.repositoryURL.value,
        item.tags.value.split(", "),
        item.aksw.value === 'true',
        item.autoUpdate.value === 'true',
        item.projects.value.split(", "),
        item.comment.value,
        item.logo.value,
        item.created.value,
        item.modified.value,
        item.documentationPage.value,
        item.tool.value,
        item.repositoryIRI.value,
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

  transformForSPARQL() {
    return {
      "repository": this.id,
      "foaf:page": this.page,
      "infai_v:lastCommit": this.lastCommit,
      "dcterms:modified": this.modified,
      "dc:description": this.description,
      "infai_v:readme": this.readme,
      "infai_v:mainContributor": this.mainContributorName,
      "infai_v:mainContributorIRI": this.mainContributorIRI,
      "infai_v:latestRelease": this.latestRelease,
      "infai_v:language": this.language,
      "infai_v:meta": this.meta,
      "dcterms:license": this.license,
    };
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

import namespace from '@rdfjs/namespace'
import prefixes from '@zazuko/prefixes/prefixes'
import mynamespaces from '@/models/namespaces';
import { getSPARQLLiteralOf, getResponseValue } from '@/utils/sparql';
const rdfs = namespace(prefixes.rdfs);
const infai_v = namespace(mynamespaces["vocab"]);
const foaf = namespace(prefixes.foaf)
const dc = namespace('http://purl.org/dc/elements/1.1/')

export class Project {
  constructor(label, page, startDate, description, duration, client, ministry, identifier, leadingPerson, consortiumLead, filesLocation, logo, repositoryBasis, id = "") {
    this.id = id;
    this.label = label;
    this.page = page;
    this.startDate = startDate;
    this.description = description;
    this.duration = duration;
    this.client = client;
    this.ministry = ministry;
    this.identifier = identifier;
    this.leadingPerson = leadingPerson;
    this.consortiumLead = consortiumLead;
    this.filesLocation = filesLocation;
    this.logo = logo;
    this.repositoryBasis = repositoryBasis;
  }

  static __namespace = mynamespaces["projects"];

  static __type = rdfs.Resource;

  static __datatypes = {
      "label": "literal",
      "page": "IRI",
      "startDate": "literal",
      "description": "literal",
      "duration": "number",
      "client": "literal",
      "ministry": "literal",
      "identifier": "literal",
      "leadingPerson": "IRI",
      "consortiumLead": "boolean",
      "filesLocation": "IRI",
      "logo": "IRI",
      "repositoryBasis": "IRI"
  };

  static __predicateMap = {
    "label": rdfs.label,
    "page": foaf.page,
    "startDate": infai_v.startDate,
    "description": dc.description,
    "duration": infai_v.duration,
    "client": infai_v.client,
    "ministry": infai_v.minstry,
    "identifier": infai_v.id,
    "leadingPerson": infai_v.leadingPerson,
    "consortiumLead": infai_v.consortiumLead,
    "filesLocation": infai_v.filesLocation,
    "logo": foaf.logo,
    "repositoryBasis": infai_v.repositoryBasis
  };

  sparqlSnippet(key) {
    const aggregates = {

    };
    if (key in aggregates) {
      return aggregates[key];
    }
    return getSPARQLLiteralOf(this, key, Project.__datatypes[key]);
  }

  static transformFromSPARQL(response) {
    const modifiedData = response.map(item => {
      return new Project(
        getResponseValue(item, "label", Project.__datatypes),
        getResponseValue(item, "page", Project.__datatypes),
        getResponseValue(item, "startDate", Project.__datatypes),
        getResponseValue(item, "description", Project.__datatypes),
        getResponseValue(item, "duration", Project.__datatypes),
        getResponseValue(item, "client", Project.__datatypes),
        getResponseValue(item, "ministry", Project.__datatypes),
        getResponseValue(item, "identifier", Project.__datatypes),
        getResponseValue(item, "leadingPerson", Project.__datatypes),
        getResponseValue(item, "consortiumLead", Project.__datatypes),
        getResponseValue(item, "filesLocation", Project.__datatypes),
        getResponseValue(item, "logo", Project.__datatypes),
        getResponseValue(item, "repositoryBasis", Project.__datatypes),
        getResponseValue(item, "id", Project.__datatypes)
      );
    }).sort((a, b) => a.label.localeCompare(b.label));
    return modifiedData;
  }
}

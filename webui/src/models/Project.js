import namespace from '@rdfjs/namespace'
import prefixes from '@zazuko/prefixes/prefixes'
import mynamespaces from '@/models/namespaces';
import { getSPARQLLiteralOf } from '@/utils/sparql';
const rdfs = namespace(prefixes.rdfs);
const infai_v = namespace(mynamespaces["vocab"]);
const foaf = namespace(prefixes.foaf)

export class Project {
  constructor(label, page, startDate, id = "") {
    this.id = id;
    this.label = label;
    this.page = page;
    this.startDate = startDate;
  }

  static __namespace = mynamespaces["projects"];

  static __type = rdfs.Resource;

  static __datatypes = {
      "label": "literal",
      "page": "IRI",
      "startDate": "literal"
  };

  static __predicateMap = {
    "label": rdfs.label,
    "page": foaf.page,
    "startDate": infai_v.startDate
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
      return new Project(item.label.value, item.page.value, item.startDate.value, item.id.value);
    }).sort((a, b) => a.label.localeCompare(b.label));
    return modifiedData;
  }
}

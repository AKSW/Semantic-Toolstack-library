import namespace from '@rdfjs/namespace'
import prefixes from '@zazuko/prefixes/prefixes'
import mynamespaces from '@/models/namespaces';
import { getSPARQLLiteralOf } from '@/utils/sparql';
const rdfs = namespace(prefixes.rdfs);
const infai_v = namespace(mynamespaces["vocab"]);

export class Tag {
  constructor(label, color, group, id = "") {
    this.id = id;
    this.label = label;
    this.color = color;
    this.group = group;
  }

  static __namespace = mynamespaces["tags"];

  static __type = rdfs.Resource;

  static __datatypes = {
      "label": "literal",
      "color": "literal",
      "group": "literal"
  };

  static __predicateMap = {
    "label": rdfs.label,
    "color": infai_v.color,
    "group": infai_v.group
  };

  sparqlSnippet(key) {
    const aggregates = {

    };
    if (key in aggregates) {
      return aggregates[key];
    }
    return getSPARQLLiteralOf(this, key, Tag.__datatypes[key]);
  }


  // Needed?
  static transformFromSPARQL(response) {
    const modifiedData = response.map(item => {
      return new Tag(
        item.label.value,
        item.color.value,
        item.group.value,
        item.id.value
      );
    }).sort((a, b) => a.label.localeCompare(b.label));
    return modifiedData;
  }
}

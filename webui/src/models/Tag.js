export class Tag {
  constructor(label, color, group, id = "") {
    this.id = id;
    this.label = label;
    this.color = color;
    this.group = group;
  }

  transformForSPARQL() {
    return {
      "tag": this.id,
      "rdfs:label": this.label,
      "infai_v:color": this.color,
      "infai_v:group": this.group,
    };
  }

  static transformFromSPARQL(response) {
    const modifiedData = response.map(item => {
      return new Tag(item.label.value, item.color.value, item.group.value, item.tag.value);
    }).sort((a, b) => a.label.localeCompare(b.label));
    return modifiedData;
  }
}

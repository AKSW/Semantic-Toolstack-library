export class Project {
  constructor(label, page, startDate, id = "") {
    this.id = id;
    this.label = label;
    this.page = page;
    this.startDate = startDate;
  }

  transformForSPARQL() {
    return {
      "project": this.id,
      "rdfs:label": this.label,
      "foaf:page": this.page,
      "infai_v:startDate": this.startDate,
    };
  }

  static transformFromSPARQL(response) {
    const modifiedData = response.map(item => {
      return new Project(item.label.value, item.page.value, item.startDate.value, item.project.value);
    }).sort((a, b) => a.label.localeCompare(b.label));
    return modifiedData;
  }
}

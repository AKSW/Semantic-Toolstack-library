from fastapi import FastAPI, HTTPException
from urllib.parse import unquote
from repo import examine_url_and_fetch_info
from SPARQLWrapper import SPARQLWrapper, POST, JSON
from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import RDF, FOAF, RDFS, DC, DCTERMS
from datetime import datetime
from urllib.parse import urlparse

app = FastAPI()

# Specify the SPARQL endpoint URL
sparql_endpoint = "http://localhost:3030/default/"

# Initialize SPARQLWrapper with the endpoint URL
sparql = SPARQLWrapper(sparql_endpoint)

# Namespaces (add more as needed)
ns = {
    "rdf": RDF,
    "rdfs": RDFS,
    "foaf": FOAF,
}
ns["dc"] = DC  # The DC namespace is predefined in rdflib
ns["dcterms"] = DCTERMS  # The DCTERMS namespace is predefined in rdflib
ns["infai_v"] = Namespace("http://infai.org/vocabs/semantictoolstack/")
ns["infai_d"] = Namespace("http://infai.org/data/semantictoolstack/")

@app.get("/updateRepoData/")
async def get_iri(iri: str):
    """
    A route that accepts an IRI as a query parameter. The IRI is the the repository resource.
    Example usage: /updateRepoData/?iri=http%3A%2F%2Fexample.com%2F%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82
    """
    print(iri)
    try:
        # Decode the IRI
        decoded_iri = unquote(iri)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error decoding IRI: {str(e)}")
    print(decoded_iri)

    repoIRI = getRepoURLFromRepoResource(decoded_iri)
    if repoIRI == "":
        raise HTTPException(status_code=400, detail="Given IRI is not valid resource in store.")
    
    repoData = examine_url_and_fetch_info(repoIRI)

    # Transform to RDF
    g = Graph()

    # Process the JSON to create RDF triples
    g.add((URIRef(decoded_iri), ns["rdf"]["type"], ns["rdfs"]["Resource"]))
    g.add((URIRef(decoded_iri), ns["foaf"]["page"], URIRef(repoIRI)))
    g.add((URIRef(decoded_iri), ns["infai_v"]["lastCommit"], Literal(repoData["last_commit_date"])))
    g.add((URIRef(decoded_iri), ns["dcterms"]["modified"], Literal(datetime.now().strftime('%d-%m-%Y'))))
    g.add((URIRef(decoded_iri), ns["dc"]["description"], Literal(repoData["description"])))
    g.add((URIRef(decoded_iri), ns["infai_v"]["readme"], Literal(repoData["readme_content"])))
    if "last_commit_author_url" in repoData and repoData["last_commit_author_url"]:
        g.add((URIRef(decoded_iri), ns["infai_v"]["mainContributorIRI"], URIRef(repoData["last_commit_author_url"])))
    g.add((URIRef(decoded_iri), ns["infai_v"]["mainContributor"], Literal(repoData["last_commit_author"])))
    g.add((URIRef(decoded_iri), ns["infai_v"]["latestRelease"], URIRef(repoData["latest_release_html_url"])))
    g.add((URIRef(decoded_iri), ns["infai_v"]["language"], Literal(repoData["language"])))
    metadata = str(repoData["forks_count"])+" forks; "+str(repoData["open_pull_requests_count"])+" PRs; "+str(repoData["number_of_issues"])+" issues"
    g.add((URIRef(decoded_iri), ns["infai_v"]["meta"], Literal(metadata)))
    g.add((URIRef(decoded_iri), ns["dcterms"]["license"], Literal(repoData["license"])))
    

    # Serialize the graph to Turtle format for the SPARQL INSERT DATA query
    graph_data = g.serialize(format="nt")

    # Construct the SPARQL update query
    query = f"""
    DELETE {{
        ?s ?p ?o .
    }}
    insert {{
        {graph_data}
    }}
    where {{
        ?s ?p ?o .
        filter(?s = <{decoded_iri}>)
    }}
    """
    print(query)

    # Initialize SPARQLWrapper
    sparql.setQuery(query)
    sparql.setMethod(POST)
    # Execute the query
    try:
        sparql.query()
        return {"message": "Data updated successfully into RDF store."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def getRepoURLFromRepoResource(resource: str):
    repo_page = ""

    # Define the SPARQL query
    sparql_query = """
        PREFIX : <http://example.com/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>

        SELECT ?repoPage
        WHERE {{
        <{resource_iri}> foaf:page ?repoPage .
        }}
    """.format(resource_iri=resource)
    print(sparql_query)

    # Set the query and return format
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    # Execute the query and process the results
    try:
        results = sparql.query().convert()
        # Extract the IRI from the results
        for result in results["results"]["bindings"]:
            repo_page = result["repoPage"]["value"]
            print("Repository Page IRI:", repo_page)
    except Exception as e:
        print("An error occurred:", e)

    return repo_page


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
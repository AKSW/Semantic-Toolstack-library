# Semantic Toolstack library

This is the code for the library of semantic tools which is updated automatically. It comes with a database, backend and frontend.

The idea is that tools are added via the webapp and its metadata from its repository is updated regularly to achieve an up-to date library of semantic tools.

This is a prototype.

Plan: docker based.

## Web GUI

Under folder webui.

Based on VueJS 3.

### Todo

* Transform sparql building into models
* Add more optic feedback
* Enhance usability
* Add more information to the models/RDF
* Add filter to the lists
* Add credentials to SPARQL endpoint
* Use logging library
* Use env to set constants

## Middleware

Under folder service.

A basic FastAPI python service.

## Database

Fuseki triple store.
Started with `jena/apache-jena-fuseki-4.10.0/fuseki-server`

### Todo

* Add credentials

## Docker

TODO

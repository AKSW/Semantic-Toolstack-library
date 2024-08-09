# Semantic Toolstack library

This is the code for the library of semantic tools which is updated automatically. It comes with a database, backend and frontend.

The idea is that tools are added via the webapp and its metadata from its repository is updated regularly to achieve an up-to date library of semantic tools.

This is a prototype.

## Web GUI

Under folder webui.

Based on VueJS 3.

## Middleware

Under folder service.

A basic FastAPI python service.

## Database

Fuseki triple store.
Started with `jena/apache-jena-fuseki-4.10.0/fuseki-server`

### Todo

* Add more security

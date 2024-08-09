#!/bin/bash

sudo ~/Documents/apache-jena-5.1.0/bin/tdb2.tdbdump --formatted=Trig --loc=./db_storage/databases/1/ > data.ntrig
~/Documents/apache-jena-5.1.0/bin/riot --syntax=TRIG --out=data.ttl --output=TURTLE data.ntrig > data.ttl

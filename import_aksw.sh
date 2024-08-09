#!/bin/bash

# Variables to hold URLs and filenames
NT_FILE_URL="https://raw.githubusercontent.com/AKSW/aksw.org-model/main/aksw.org.nt"
GRAPH_FILE_URL="https://raw.githubusercontent.com/AKSW/aksw.org-model/main/aksw.org.nt.graph"
NT_FILE="aksw.nt"
GRAPH_FILE="aksw.graph"
TDB_DIRECTORY="./db_storage/databases/1/"

docker stop semantic-toolstack-library-db-1
sleep 1s

# Download the .nt and .graph files
echo "Downloading .nt file..."
curl -o $NT_FILE $NT_FILE_URL

echo "Downloading .graph file..."
curl -o $GRAPH_FILE $GRAPH_FILE_URL

# Extract the named graph URI from the .graph file
NAMED_GRAPH_URI=$(head -n 1 $GRAPH_FILE)

# Check if the named graph URI was found
if [ -z "$NAMED_GRAPH_URI" ]; then
    echo "Error: No named graph URI found in the .graph file."
    exit 1
fi

echo "Named Graph URI found: $NAMED_GRAPH_URI"
# Import the converted .nt file into TDB with the specified named graph
echo "Importing the converted .nt file into TDB..."
sudo ~/Documents/apache-jena-5.1.0/bin/tdb2.tdbloader --graph=$NAMED_GRAPH_URI --loc=$TDB_DIRECTORY $NT_FILE

echo "Import completed."

# Clean up temporary files
rm $NT_FILE $GRAPH_FILE

docker start semantic-toolstack-library-db-1
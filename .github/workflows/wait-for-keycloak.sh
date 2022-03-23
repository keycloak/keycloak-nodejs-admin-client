#!/bin/sh

HOST=${1:-localhost}
PORT=${2:-8080}
RETRIES=60

echo -n "Waiting for keycloak to start on ${HOST}:${PORT}"
until curl -f -s "http://${HOST}:${PORT}/realms/master" > /dev/null
do
    RETRIES=$(($RETRIES - 1))
    if [ $RETRIES -eq 0 ]
    then
        echo "Failed to connect"
        exit 1
    fi
    sleep 1
done

#!/bin/bash
SWARM_NAME=nodejs-hapi

#set up full path for the environments
export BACKEND_PATH=`pwd`

#check docker environment files
declare -a ENV_FILES=("docker/.docker_env")


if [ ! -f $ENV_FILES ] ; then
  echo "Please configure your $ENV_FILES Docker environment file"
  cp $ENV_FILES.example $ENV_FILES
fi

# Deploy
docker stack deploy -c ./docker/dev-compose.yml $SWARM_NAME

# Get starting container ID for backend
WEBAPP_CONTAINER_ID=`docker container ls | grep ${SWARM_NAME}_webapp.1 | awk '{ print $1 }'`
while [ -z $WEBAPP_CONTAINER_ID ] ; do
  sleep 2
  WEBAPP_CONTAINER_ID=`docker container ls | grep ${SWARM_NAME}_webapp.1 | awk '{ print $1 }'`
done

# Log/Debug
docker logs -f $WEBAPP_CONTAINER_ID

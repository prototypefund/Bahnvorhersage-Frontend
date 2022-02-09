# Run this script to test your changes on next.trainconnectionprediction.de

DOCKER_BUILDKIT=1 DEV_SERVER=1 docker build -f Dockerfile . -t trainconnectionprediction/next-frontend:latest

docker push trainconnectionprediction/next-frontend:latest

kubectl rollout restart deployment/next-frontend
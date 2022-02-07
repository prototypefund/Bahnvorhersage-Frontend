FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build --modern
RUN find /app/dist -type f -regex '.*\.\(htm\|html\|txt\|text\|js\|css\|json\)$' -exec gzip -f -k {} \;

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
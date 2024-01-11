FROM node:20-alpine AS build

WORKDIR /app 

COPY package.json .

RUN npm i

COPY . .

RUN npm run build 

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/sites-available/default

EXPOSE 80 443

CMD [ "nginx", "-g", "daemon off;"]
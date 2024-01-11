FROM node:20-alpine AS build 

WORKDIR /app 

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

FROM node:20-alpine 

WORKDIR /app 

COPY package.json . 
COPY --from=build /app/build /app/build 
COPY --from=build /app/.env /app/

RUN npm i --production

CMD [ "node", "/app/build/index.js" ]

EXPOSE 8002
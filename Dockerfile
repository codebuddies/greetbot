FROM node:8-alpine
WORKDIR /app
ENV PORT=3000
ADD package.json .
ADD src ./src
ADD test ./test
RUN npm i

CMD ["npm", "run", "start:dev"]

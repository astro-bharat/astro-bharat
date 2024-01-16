FROM node:lts-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/bin/www"]

# For building Docker image
# docker build -t bus-ticketing-backend.

# TO start docker container
# docker run -p 3000:3000 bus-ticketing-backend

# To stop docker container
# docker stop bus-ticketing-backend

# To remove Docker image
# docker rmi bus-ticketing-backend
# Node Challenge 

## Description

A new company needs to address these requirements:
- Create a Node API with Typescript.
- Connect the Node API to MongoDB using mongoose (desirable models in typescript).
- We need to develop three endpoints behind a basic authentication (username and password).
- Create a user with name, last name, address, and profile picture (this should be a file).
- Retrieve users.
- Update user.

## Installation

```bash
$ npm install
```

## Setting up local environment


### Running dependencies on docker

```bash
docker-compose up -d mongodb
```

### Configuring env variables 

```bash
export MONGO_URI=mongodb://user:pass1234@localhost:27017/node_challenge?authSource=admin
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# Running it using docker 
$ docker-compose up -d
```

## Test

```bash
# Seed the database 
$ npm run test:seed

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation / Test with swagger

1. Run the seeds in the local environment 
2. Run the application 
3. Open the following url in the browser http://localhost:3000/docs

![swaggger](swagger.docs.png)

4. Press Authorize button and introduce the following information
  - user: user1 
  - password: password 
5. Test the endpoints! 
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

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Test Request 


### Creating user 
```bash 
curl -XPOST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==' \  
  -d '{"name": "John", "lastName": "Doe", "address": "Fake Street 123"}'
```

### Listing users 
```bash 
curl -XGET http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'
```

### Find users 
```bash 
curl -XGET http://localhost:3000/users/6452fb90448bbf6d70deab1d \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'
```

### Updating users 
```bash 
curl -XPATCH http://localhost:3000/users/6452fb90448bbf6d70deab1d \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==' \
  -H 'Accept: application/json' \
  -d '{ "address": "7th Street 225" }'
```
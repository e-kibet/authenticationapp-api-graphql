const { ApolloServer,gql } = require('apollo-server-express');
const bodyParser = require('body-parser')
const express = require('express')
const {
   GraphQLUpload,
   graphqlUploadExpress,
 } = require('graphql-upload');
const app = express()


app.use(bodyParser.json());
app.use(graphqlUploadExpress());

const fs = require('fs');
const resolvers = require('./graphql/resolvers');
const { getPayload } = require('./helpers/util.helper');
const typeDefs = gql(fs.readFileSync('./graphql/typeDefs.graphql',{encoding:'utf-8'}));

const server = new ApolloServer({typeDefs,resolvers, context: req => ({req})});


const startAppServer = async () => {
   await server.start()
   server.applyMiddleware({
      app,
      cors: true
   });
   
   
   
   app.listen(5000, () => {
      console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
   }); 

}

startAppServer()

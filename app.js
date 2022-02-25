const { ApolloServer,gql } = require('apollo-server');

const fs = require('fs');
const resolvers = require('./graphql/resolvers');
const { getPayload } = require('./helpers/util.helper');
const typeDefs = gql(fs.readFileSync('./graphql/typeDefs.graphql',{encoding:'utf-8'}));

const server = new ApolloServer({typeDefs,resolvers, context: req => ({req})
});

server.listen(5000).then(({ url }) => {	
   console.log("Server ready at " +   url );     
}); 
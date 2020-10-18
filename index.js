const { ApolloServer,  gql } = require('apollo-server');

//servidor
const server = new ApolloServer();

//arrancar el servidor
server.listen().then(({url}) => {
    console.log('servidor listro')
})
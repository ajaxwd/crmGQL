const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = require('./config/db');

// Conectar a la base de datos
conectarDB();

//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const usuario =  jwt.verify(token, process.env.SECRETA)
                return {
                    usuario
                }
            } catch (error) {
                console.log('Huvo u error');
                console.log(error);
            }
        }
    }
});

//arrancar el servidor
server.listen().then(({url}) => {
    console.log('servidor listro')
})
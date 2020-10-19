const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`

    type Usuario {
        id: ID
        numbre: String
        apellido: String
        email: String
        creado: String
    }

    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }
    type Query{
        obtenerCurso: String
    }

    type Mutation {
        nuevoUsuario(input: UsuarioInput) : String
    }
`;

module.exports = typeDefs;
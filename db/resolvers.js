
//Resolvers
const resolvers = {
    Query: {
        obtenerCurso = () => "Algo"
    }, 
    Mutation: {
        nuevoUsuario: (_, {input}) => {
            console.log(input);

            return "Creado..."
        }
    }
}

module.exports = resolvers;
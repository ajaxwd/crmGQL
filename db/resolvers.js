const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');

//Resolvers
const resolvers = {
    Query: {
        obtenerCurso = () => "Algo"
    }, 
    Mutation: {
        nuevoUsuario: (_, {input}) => {
           
            const { email, password } = input;

            //Revisar si el usuario a existe
            const existeUsuario = await Usuario.findOne({email});
            if(existeUsuario){
                throw new Error('El usuario ya esta registrado');
            }
            console.log(existeUsuario);
            //Hashear su clave
            const slat = await bcryptjs.getSalt(10);
            input.password = await bcryptjs.hash(password, slat);
            
            try {
            //Guardar el usuario en la base de datos
            const usuario = new Usuario(input);
            usuario.save();
            return usuario;    
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports = resolvers;
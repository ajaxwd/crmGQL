const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const crearToken = (usuario, secreta, expiresIn) => {

    const { id, email, nombre, apellido } = usuario;

    return jwt.sign( { id}, secreta, {expiresIn})

} 

//Resolvers
const resolvers = {
    Query: {
        obtenerUsuario: async (_, {token}) => {
            const usuarioId = await jwt.verify(token, process.env.SECRETA)

            return usuarioId
        }
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
        },    
            autenticarUsuario: async (_,{ input }) => {
                const { email, password } = input;

                //Revisar si el usuario a existe
                const existeUsuario = await Usuario.findOne({email});
                if(!existeUsuario){
                    throw new Error('El usuario no existe');
                }

                //Revisar si el password es correcto
                const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
                if (!passwordCorrecto) {
                    throw new Error('El password es incorrecto');
                }
                //Crear el token
                return {
                    token: crearToken(existeUsuario, process.env.SECRETA, '24h')
                }
            }
       
    }
}

module.exports = resolvers;
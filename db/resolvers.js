const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Cliente = require('../models/Cliente');
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
        },
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find({});
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async (_, {id}) => {
           
            //Revisar si el producto existe
            const producto = await Producto.findById(id);
            
            if(!producto) {
                throw new Error('Producto no encontrado');
            }

            return producto;
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
            },
            nuevoProducto: async (_, {input}) => {
                try {
                    const producto = new Producto(input);

                    //almacenar en la bd
                    const resultado = await producto.save();

                    return resultado;
                } catch (error) {
                    console.log(error);
                }

            },
            actualizarProducto: async (_, {id, input}) => {
                 //Revisar si el producto existe
                const producto = await Producto.findById(id);
                
                if(!producto) {
                    throw new Error('Producto no encontrado');
                }

                //Guardar producto en la bd
                producto = await Producto.findOneAndUpdate({_id: id}, input, {new: true});

                return producto;
            },
            eliminarProducto: async (_, {id}) =>{
                 //Revisar si el producto existe
                 const producto = await Producto.findById(id);
                
                 if(!producto) {
                     throw new Error('Producto no encontrado');
                 }

                 await Producto.findByIdAndDelete({_id: id});

                 return "Producto eliminado"; 
 
            },
            nuevoCliente: async (_, {input}) => {

                const { email } = input;
                // VErificar si el cliente esta registrado
                const cliente = await Cliente.findOne({email});
                if (cliente) {
                    throw new Error('el cliente ya esta registrado');
                }
                
                const nuevoCliente = new Cliente(input);
                // Asignar vendedor
                nuevoCliente.vendedor = "";

                // Guardar en la base de datos
                try {
                    const resultado = await nuevoCliente.save();
                    return resultado;    
                } catch (error) {
                    console.log(error);
                }

                
            }
       
    }
}

module.exports = resolvers;
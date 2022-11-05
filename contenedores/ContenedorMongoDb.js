import mongoose from 'mongoose'
import { config } from '../config.js'

// conexion a la base de datos

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema);
    }

    // MENSAJES

    async listar(id) {
        try {
            const registro = await this.coleccion.find({ id: id });
            if (registro.length > 0) {
                //console.log('--Mostrando registro--');
                //console.log(registro);
                return registro;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async listarAll() {
        try {
            const registros = await this.coleccion.find({});
            if (registros.length > 0) {
                //console.log('--Mostrando registros--');
                //console.log(registros);
            } else {
                console.log("No hay resgistros");
            }
            return registros;
        } catch (error) {
            console.log(error);
        }
    }

    async guardar(objeto) {
        try {
            const registros = await this.listarAll();
            if (registros.length > 0) {
                let ultimoId = 0;
                for (let i = 0; i < registros.length; i++) {
                    if (registros[i].id > ultimoId) {
                        ultimoId = registros[i].id;
                    }
                }
                objeto["id"] = (ultimoId + 1);
                console.log(ultimoId + 1);
            } else {
                objeto["id"] = 1;
            }
            await this.coleccion.collection.insertOne(objeto);
            console.log("Producto guardado");
        } catch (error) {
            console.log(error);
        }
    }

    async actualizarMensaje(elem, id) {
        try {
            const registroBuscado = await this.listar(id);
            if (registroBuscado.length > 0) {
                await this.coleccion.updateOne({ id: id }, {
                    $set: {
                        author: elem.author,
                        text: elem.text,
                        id: elem.id
                    }
                });
                console.log("Producto actualizado");
            } else {
                console.log("Producto no encontrado");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async borrarPorId(id) {
        try {
            const registroBuscado = await this.listar(id);
            if (registroBuscado.length > 0) {
                await this.coleccion.deleteOne({ id: id });
                console.log("Registro borrado")
            } else {
                console.log("No se encuentra el resgistro")
            }
            return registroBuscado;
        } catch (error) {
            console.log(error);
        }
    }

    async borrarTodo() {
        try {
            await this.coleccion.deleteMany({});
            console.log("Todos los registros fueron eliminados");
        } catch (error) {
            console.log(error);
        }

    }

}


export default ContenedorMongoDb;
import { json } from 'express';
import knex from 'knex'

class ContenedorSQL {

    constructor(config, tabla) {
        this.knex = knex(config);
        this.tabla = tabla;
    }

    async listar(id) {
        try {
            const registro = await this.knex.from(this.tabla).select('*').where('id', id);
            if (registro.length > 0) {
                console.log('--Mostrando registro--');
                console.log(registro);
            } else {
                console.log("Registro no encontrado");
            }
        } catch (error) {
            console.log(error);
        } /*finally {
            await this.knex.destroy();
        }*/
    }

    async listarAll() {
        try {
            const registros = await this.knex.from(this.tabla).select('*');
            if (registros.length > 0) {
                console.log('--Mostrando registros--');
                console.log(registros);
            } else {
                console.log("Tabla vacía");
            }
            return registros;
        } catch (error) {
            console.log(error);
        } /*finally {
            await this.knex.destroy();
        }*/
    }

    async guardar(elem) {
        try {
            console.log(elem.author)
            await this.knex.from(this.tabla).insert(elem);
            console.log('Registro insertado');
            return elem;
        } catch (error) {
            console.log(error);
        } /*finally {
            await this.knex.destroy();
        }*/

    }

    async actualizarProducto(elem, id) {
        try {
            const registro = await listar(id);
            if (registro.length > 0) {
                await this.knex.from(this.tabla).update(
                    registro.title = elem.title,
                    registro.price = elem.price,
                    registro.thumbnail = elem.thumbnail,
                    registro.id = elem.id
                )
                console.log("Registro actualizado");
            } else {
                console.log("Registro no encontrado");
            }

        } catch (error) {
            console.log(error);
        } /*finally {
            await this.knex.destroy();
        }*/
    }

    async actualizarMensaje(elem, id) {
        try {
            const registro = await listar(id);
            if (registro.length > 0) {
                await this.knex.from(this.tabla).update(
                    registro.author = elem.author,
                    registro.text = elem.text,
                    registro.id = elem.id
                )
                console.log("Registro actualizado");
            } else {
                console.log("Registro no encontrado");
            }

        } catch (error) {
            console.log(error);
        } /*finally {
            await this.knex.destroy();
        }*/
    }


    async borrar(id) {
        try {
            const registro = await listar(id);
            if (registro.length > 0) {
                await this.knex.from(this.tabla).delete().where('id', id);
                console.log("Registro eliminado");
            } else {
                console.log('Registro no encontrado');
            }

        } catch (error) {
            console.log(error);
        } /*finally {
            await this.knex.destroy();
        }*/
    }

    async borrarAll() {
        try {
            await this.knex.from(this.tabla).delete();
            console.log("Todos los registros fueron borrados");
        } catch (error) {
            console.log(error);
        } /*finally {
            await this.knex.destroy();
        }*/

    }

}

export default ContenedorSQL
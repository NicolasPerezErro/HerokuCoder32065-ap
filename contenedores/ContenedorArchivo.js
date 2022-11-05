import fs from 'fs'
import { config } from '../src/config.js'
import logger from '../logger/logger.js'

class ContenedorArchivo {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.vecObj = [];
    }

    async listar(id) {
        try {
            const contenido = await fs.promises.readFile(`${config.fileSystem.path}${this.nombreArchivo}`, 'utf-8');
            if (contenido.length > 0) {
                this.vecObj = JSON.parse(contenido, null, '\t');;
                let idEncontrado = false;
                let pos;
                for (let i = 0; i < this.vecObj.length; i++) {
                    if (this.vecObj[i].id == id) {
                        idEncontrado = true;
                        pos = i;
                    }
                }

                if (idEncontrado) {
                    return this.vecObj[pos];
                } else {
                    return null;
                }
            } else {
                console.log("Archivo vacío");
            }
        } catch (error) {
            logger.error(`${error}`)
            throw new Error('Error de lectura');
        }

    }

    async listarAll() {
        try {
            const contenido = await fs.promises.readFile(`${config.fileSystem.path}${this.nombreArchivo}`, 'utf-8');
            if (contenido.length > 0) {
                this.vecObj = JSON.parse(contenido, null, '\t');
            } else {
                console.log("Archivo vacío");
            }
            return this.vecObj;
        } catch (error) {
            logger.error(`${error}`)
            throw new Error('Error de lectura');
        }

    }

    async guardar(objeto) {
        try {
            const contenido = await fs.promises.readFile(`${config.fileSystem.path}${this.nombreArchivo}`, 'utf-8');
            try {
                if (contenido.length > 0) {
                    let ultimoId = 0;
                    this.vecObj = JSON.parse(contenido, null, '\t');
                    for (let i = 0; i < this.vecObj.mensajes.length; i++) {
                        if (this.vecObj.mensajes[i].id > ultimoId) {
                            ultimoId = this.vecObj.mensajes[i].id;
                        }
                    }
                    objeto["id"] = (ultimoId + 1);
                    console.log(ultimoId + 1);
                } else {
                    objeto["id"] = 1;
                }
                this.vecObj.mensajes.push(objeto);
                await fs.promises.writeFile(`${config.fileSystem.path}${this.nombreArchivo}`, `${JSON.stringify(this.vecObj, null, '\t')}`);
                console.log("Escritura exitosa");

            } catch (error) {
                logger.error(`${error}`)
                throw new Error('Error de escritura');
            }
            return objeto.id;
        } catch (error) {
            logger.error(`${error}`)
            throw new Error('Error de lectura');
        }
    }

    async actualizarMensaje(objeto, id) {
        try {
            const contenido = await fs.promises.readFile(`${config.fileSystem.path}${this.nombreArchivo}`, 'utf-8');
            try {
                if (contenido.length > 0) {
                    this.vecObj = JSON.parse(contenido, null, '\t');
                    let idEncontrado = false;
                    let pos;
                    for (let i = 0; i < this.vecObj.length; i++) {
                        if (this.vecObj[i].id == id) {
                            idEncontrado = true;
                            pos = i;
                        }
                    }

                    if (idEncontrado) {
                        //this.vecObj[pos].timestamp = Date.now();
                        this.vecObj[pos].author = objeto.author;
                        this.vecObj[pos].text = objeto.text;
                        this.vecObj[pos].id = objeto.id;
                    }

                } else {
                    console.log('producto no encontrado');
                }
                await fs.promises.writeFile(`${config.fileSystem.path}${this.nombreArchivo}`, `${JSON.stringify(this.vecObj, null, '\t')}`);
                console.log("Actualizacion exitosa");
            } catch (error) {
                logger.error(`${error}`)
                throw new Error('Error de escritura');
            }
        } catch (error) {
            logger.error(`${error}`)
            throw new Error('Error de lectura');
        }
    }

    async borrar(id) {
        try {
            const contenido = await fs.promises.readFile(`${config.fileSystem.path}${this.nombreArchivo}`, 'utf-8');
            try {
                if (contenido.length > 0) {
                    this.vecObj = JSON.parse(contenido, null, '\t');
                    let idEncontrado = false;
                    let pos;
                    for (let i = 0; i < this.vecObj.length; i++) {
                        if (this.vecObj[i].id == id) {
                            idEncontrado = true;
                            pos = i;
                        }
                    }

                    if (idEncontrado) {
                        this.vecObj.splice(pos, 1);
                        await fs.promises.writeFile(`${config.fileSystem.path}${this.nombreArchivo}`, `${JSON.stringify(this.vecObj, null, '\t')}`);
                        console.log("Objeto eliminado");
                    } else {
                        console.log("id no encontrado");
                    }

                } else {
                    console.log("Archivo vacío");
                }
            } catch (error) {
                logger.error(`${error}`)
                throw new Error('Error de escritura');
            }

        } catch (error) {
            throw new error('Error de lectura');
        }
    }

    async borrarTodo() {
        const vecAux = await this.getAll();
        if (vecAux.length > 0) {
            vecAux.length = 0;
        }
        try {
            await fs.promises.writeFile(`${config.fileSystem.path}${this.nombreArchivo}`, `${JSON.stringify(vecAux, null, '\t')}`);
            console.log('Todos los objetos fueron eliminados');
        } catch (error) {
            logger.error(`${error}`)
            throw new Error('Error de escritura');
        }
    }

}

export default ContenedorArchivo;
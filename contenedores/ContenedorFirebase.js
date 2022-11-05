import admin from "firebase-admin"
import config from '../config.js'

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL: ''
})

const db = admin.firestore();

class ContenedorFirebase {

    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion);
    }

    // PROD Y CARRITO

    async listar(id) {
        try {
            const registros = await this.listarAll();
            if (registros.length > 0) {
                let idEncontrado = false;
                let idDoc = 0;
                // busco id del documento por id
                for (let i = 0; i < registros.length; i++) {
                    if (registros[i].id == id) {
                        idEncontrado = true;
                        idDoc = registros[i].idDoc;
                    }
                }

                if (idEncontrado) {
                    const doc = this.coleccion.doc(`${idDoc}`);
                    const item = await doc.get();
                    const response = item.data();
                    return response;
                } else {
                    return null;
                }
            } else {
                console.log('vacio');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async listarAll() {
        try {
            const querySnapshot = await this.coleccion.get();
            const docs = querySnapshot.docs;
            const response = docs.map((doc) => ({
                idDoc: doc.id,
                id: doc.data().id,
                author: doc.data().author,
                text: doc.data().text
            }));
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async guardar(objeto) {
        try {
            const registros = await this.listarAll();
            let ultimoIdDocum = 0;
            if (registros.length > 0) {
                let ultimoId = 0;
                for (let i = 0; i < registros.length; i++) {
                    if (registros[i].id > ultimoId) {
                        ultimoId = registros[i].id;
                    }

                    if (parseInt(registros[i].idDoc) > ultimoIdDocum) {
                        ultimoIdDocum = parseInt(registros[i].idDoc);
                    }
                }
                objeto["id"] = (ultimoId + 1);
            } else {
                objeto["id"] = 1;
                ultimoIdDocum = '1';
            }
            ultimoIdDocum = ultimoIdDocum + 1;
            let doc = this.coleccion.doc(`${ultimoIdDocum}`);
            await doc.create(objeto);
        } catch (error) {
            console.log(error);
        }
    }

    async actualizarMensaje(elem, id) {
        try {
            const registros = await this.listar();
            if (registros.length > 0) {
                let idEncontrado = false;
                let idDoc = 0;
                // busco id del documento por id del producto
                for (let i = 0; i < registros.length; i++) {
                    if (registros[i].id == id) {
                        idEncontrado = true;
                        idDoc = registros[i].idDoc;
                    }
                }

                if (idEncontrado) {
                    const doc = this.coleccion.doc(`${idDoc}`);
                    await doc.update({
                        author: elem.author,
                        text: elem.text,
                        id: elem.id
                    })

                } else {
                    console.log('no se encuentra');
                }

            } else {
                console.log("no hay productos");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async borrar(id) {
        try {
            const registros = await this.listarAll();
            if (registros.length > 0) {
                let idEncontrado = false;
                let idDoc = 0;
                // busco id del documento por id
                for (let i = 0; i < registros.length; i++) {
                    if (registros[i].id == id) {
                        idEncontrado = true;
                        idDoc = registros[i].idDoc;
                    }
                }

                if (idEncontrado) {
                    const doc = this.coleccion.doc(`${idDoc}`);
                    await doc.delete();
                    console.log("Registro borrado");
                } else {
                    console.log('no se encuentra');
                }

            } else {
                console.log('vacio');
            }
        } catch (error) {
            console.log(error);
        }
    }
}



export default ContenedorFirebase;
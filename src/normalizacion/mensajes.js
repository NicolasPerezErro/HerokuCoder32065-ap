import normalizr from 'normalizr';

async function normalizarMensajes(mensajes) {
    const normalize = normalizr.normalize;
    const schema = normalizr.schema;

    const autor = new schema.Entity('autor');
    const msg = new schema.Entity('mensaje', {
        author: autor
    });
    const posts = new schema.Entity('posts', {
        mensajes: [msg]
    });

    const normalizedMensajes = normalize(mensajes, posts);

    return normalizedMensajes;
}

export { normalizarMensajes } 
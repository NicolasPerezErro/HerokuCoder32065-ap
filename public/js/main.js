const socket = io.connect();

//------------------------------------------------------------------------------------
// PRODUCTOS
const formAgregarProducto = document.getElementById('formAgregarProducto')
//añade un evento que se ejecuta del lado del cliente cuando usa el id submit
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    //Armar objeto producto y emitir mensaje a evento update
    const producto = {
        title: document.getElementById('nombre').value,
        price: document.getElementById('precio').value,
        thumbnail: document.getElementById('foto').value
    };
    socket.emit('update', producto);
});

socket.on('productos', productos => {
    //generar el html y colocarlo en el tag productos llamando al funcion makeHtmlTable
    makeHtmlTable(productos).then(value => {
        document.getElementById('productos').innerHTML = value;
    }
    );
});


function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos });
            return html;
        });
};

// --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- 

async function desNormalizarMensajes(mensajes) {
    const denormalize = normalizr.denormalize;
    const schema = normalizr.schema;

    const autor = new schema.Entity('autor');
    const msg = new schema.Entity('mensaje', {
        author: autor
    });
    const posts = new schema.Entity('posts', {
        mensajes: [msg]
    });

    const denormalizedMensajes = denormalize(
        mensajes.result, posts, mensajes.entities);

    return denormalizedMensajes;
}
/* ----------------------------------------------------------------------------- */


// CHAT
const inputUsername = document.getElementById('inputUsername');
const inputMensaje = document.getElementById('inputMensaje');
const btnEnviar = document.getElementById('btnEnviar');

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    //Armar el objeto de mensaje y luego emitir mensaje al evento nuevoMensaje con sockets
    const hoy = new Date();
    const mensaje = {
        author: {
            id: inputUsername.value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
            fechayHora: `[${hoy.toLocaleDateString()} ${hoy.toLocaleTimeString()}]`
        },
        text: inputMensaje.value
    };
    formPublicarMensaje.reset();
    inputMensaje.focus();
    socket.emit('nuevo-mensaje', mensaje);
});

socket.on('mensajes', async mensajes => {
    console.log(mensajes);

    let mensajesDesnormalizado = await desNormalizarMensajes(mensajes);
    console.log(mensajesDesnormalizado)

    const html = mensajesDesnormalizado.mensajes.map(elem => {
        return (`<div><strong style="color:blue">${elem.author.id}</strong> <font style="color:brown">${elem.author.fechayHora}:</font> <em style="color:green">${elem.text}</em> <img width="50" src="${elem.author.avatar}" alt=" "> </div>`)
    }).join(" ");
    document.getElementById('mensajes').innerHTML = html;
});

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
});

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
});
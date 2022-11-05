
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import passport from 'passport';
import parseArgs from 'minimist';
import cluster from 'cluster';
import os from 'os';

import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';

import { config } from './config.js';

import { normalizarMensajes } from './normalizacion/index.js'

import { conectarDB } from './controllersdb.js';

import logger from '../logger/logger.js'

// ruta raiz

import __dirname from '../__dirname.js'

// contenedores

import ContenedorSQL from '../contenedores/ContenedorSQL.js';
import ContenedorArchivo from '../contenedores/ContenedorArchivo.js';

// routes

import productosApiRouter from './routers/api/productos.js';
import authWebRouter from './routers/web/auth.js'
import homeWebRouter from './routers/web/home.js'
import registerWebRouter from './routers/web/register.js'
import infoRouter from './routers/web/info.js'
import randomRouter from './routers/api/randoms.js'

// dotenv

dotenv.config();

// minimist

const options = {
    default: { puerto: 8080, modo: 'FORK' },
    alias: { p: 'puerto', m: 'modo' }
}

const args = parseArgs(process.argv.slice(2), options);

if (cluster.isPrimary && args.m === 'CLUSTER') {

    const numCpu = os.cpus().length;

    console.log('Cantidad de nucleos:' + numCpu)
    console.log('PID master: ' + process.pid)

    for (let i = 0; i < numCpu; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        cluster.fork();
    })

} else {

    //--------------------------------------------
    // instancio servidor, socket y api

    const app = express();
    const httpServer = new HttpServer(app);
    const io = new IOServer(httpServer);

    const productosApi = new ContenedorSQL(config.mariaDb, 'productos');
    const mensajesApi = new ContenedorArchivo('mensajes.json');

    //--------------------------------------------

    // configuro el socket

    io.on('connection', async socket => {
        console.log('nuevo cliente conectado');

        //cargo historial de productos y mensajes
        io.emit('productos', await productosApi.listarAll());
        io.emit('mensajes', await normalizarMensajes(await mensajesApi.listarAll()));

        //-----------------------------------------------------
        socket.on('update', async producto => {
            //guardo en base de datos mariadb
            await productosApi.guardar(producto);
            io.sockets.emit('productos', await productosApi.listarAll());
        });

        socket.on('nuevo-mensaje', async data => {
            //guardo archivo
            await mensajesApi.guardar(data);
            //normalizo mensaje
            const mensajeNormalizado = await normalizarMensajes(await mensajesApi.listarAll());
            io.sockets.emit('mensajes', mensajeNormalizado);
        });
    });

    //--------------------------------------------

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));

    app.engine('.hbs', handlebars({
        extname: '.hbs', defaultLayout: 'main.hbs', layoutsDir: __dirname + '/views/layouts'
    }));
    app.set('view engine', '.hbs');
    app.set('views', './views');

    // passport

    app.use(passport.initialize());
    app.use(passport.session());

    //--------------------------------------------

    // config del session (Mongo Atlas)

    app.use(session(config.mongoRemote))

    //--------------------------------------------

    // config routes

    app.use('/api/', productosApiRouter, randomRouter)
    app.use('/', authWebRouter, homeWebRouter, registerWebRouter, infoRouter)
    app.use("*", (req, res) => {
        logger.warn(`Ruta: ${req.url} y metodo: ${req.method} no implementados`)
        res.render('../views/routing-error')

    });

    conectarDB(config.mongodb.cnxStr, err => {

        if (err) return logger.error('error en conexión de base de datos', err);
        logger.info('BASE DE DATOS CONECTADA');
        logger.info(`MODO ${args.m}`)

        app.listen(args.p || 8080, (err) => {
            if (err) return logger.error('error en listen server', err);
            logger.info(`Server running on port ${args.p}`);
        });
    });

}



